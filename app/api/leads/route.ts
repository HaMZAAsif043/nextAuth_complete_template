import { NextRequest, NextResponse } from "next/server"
import  prisma  from "@/lib/prisma"
import { z } from "zod"
import { resolveAddressFromPostcode } from "@/lib/geocoding"

// Validate incoming lead data
const leadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  fullAddress: z.string().optional(),
  // postCode: z.string().min(4, "Post code must be valid"),
  propertyType: z.string().min(1, "Property type is required"),
  roofType: z.string().min(1, "Roof type is required"),
  electricityBill: z.string().min(1, "Electricity bill is required"),
  comments: z.string().optional(),
})

async function ensureLeadsTableExists() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS leads (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      "phoneNumber" TEXT UNIQUE NOT NULL,
      "propertyType" TEXT NOT NULL,
      "roofType" TEXT NOT NULL,
      "electricityBill" TEXT NOT NULL,
      "fullAddress" TEXT,
      comments TEXT,
      "aiScore" FLOAT DEFAULT 0,
      "scoringDetails" JSON,
      status TEXT DEFAULT 'new',
      notes TEXT,
      "createdAt" TIMESTAMP DEFAULT NOW(),
      "updatedAt" TIMESTAMP DEFAULT NOW(),
      "contactedAt" TIMESTAMP,
      "qualifiedAt" TIMESTAMP
    );
  `);
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get("limit")) || undefined;
    const page = Number(url.searchParams.get("page")) || 1;
    const skip = limit ? (page - 1) * limit : undefined;
    const name = url.searchParams.get("name") || undefined;
    const date = url.searchParams.get("date") || undefined;       // expects "YYYY-MM-DD"
    const sortBy = url.searchParams.get("sortBy") || undefined;     // "name" | "date"
    const sortOrder = url.searchParams.get("sortOrder") || undefined; // "asc" | "desc"

    // ── Build where clause ──
    const where: Record<string, unknown> = {};

    if (name) {
      where.name = { contains: name, mode: "insensitive" };
    }

    if (date) {
      const from = new Date(`${date}T00:00:00.000Z`);
      const to = new Date(`${date}T23:59:59.999Z`);
      where.createdAt = { gte: from, lte: to };
    }

    // ── Build orderBy clause ──
    let orderBy: Record<string, string> = { createdAt: sortOrder === "asc" ? "asc" : "desc" }; // default always respects sortOrder

    if (sortBy === "name") {
      orderBy = { name: sortOrder === "asc" ? "asc" : "desc" };
    } else if (sortBy === "date" || !sortBy) {
      orderBy = { createdAt: sortOrder === "asc" ? "asc" : "desc" };
    }

    // ── Query ──
    const [leads, total] = await Promise.all([
      prisma.leads.findMany({
        where,
        orderBy,
        take: limit,
        skip,
      }),
      prisma.leads.count({ where }),  // total for pagination
    ]);

    const normalizedLeads = leads.map((lead) => ({
      id: lead.id,
      name: lead.name,
      email: lead.email,
      phoneNumber: lead.phoneNumber,
      propertyType: lead.propertyType,
      roofType: lead.roofType,
      electricityBill: lead.electricityBill,
      comments: lead.comments,
      fullAddress: lead.fullAddress || lead.notes,
      createdAt: lead.createdAt,
      status: lead.status,
      aiScore: lead.aiScore,
    }));

    return NextResponse.json({ leads: normalizedLeads, total }, { status: 200 });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching leads.", error },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate data
    const validated = leadSchema.parse(body)

    // Check for duplicate email or phone number
    const existingLead = await prisma.leads.findFirst({
      where: {
        OR: [
          { email: validated.email },
          { phoneNumber: String(validated.phoneNumber) },
        ],
      },
    })

    if (existingLead) {
      const isDuplicateEmail = existingLead.email === validated.email
      const isDuplicatePhone = existingLead.phoneNumber === String(validated.phoneNumber)
      let message = "A lead with this "
      if (isDuplicateEmail && isDuplicatePhone) message += "email and phone number already exists."
      else if (isDuplicateEmail) message += "email already exists. Please use a different email."
      else message += "phone number already exists. Please use a different phone number."

      return NextResponse.json({ message }, { status: 409 })
    }

    // const providedAddress = validated.fullAdd  ress?.trim() || ""
    // const resolvedAddress = providedAddress || await resolveAddressFromPostcode(validated?.postCode)

    // Create new lead in database
    // const newLead = await prisma.leads.create({
    //   data: {
    //     name: validated.name,
    //     email: validated.email,
    //     phoneNumber: String(validated.phoneNumber),
    //     propertyType: validated.propertyType,
    //     roofType: validated.roofType,
    //     electricityBill: String(validated.electricityBill),
    //     fullAddress: resolvedAddress ,
    //     comments: validated.comments?.trim() ? validated.comments : null,
    //     // Persist postcode-derived full address for admin UX and follow-up workflows.
    //     notes: resolvedAddress ,
    //   },
    // })

    const newLead = await prisma.leads.create({
      data: {
        name: validated.name,
        email: validated.email,
        phoneNumber: String(validated.phoneNumber),
        propertyType: validated.propertyType,
        roofType: validated.roofType,
        electricityBill: String(validated.electricityBill),
        fullAddress: validated.fullAddress?.trim() || null,
        comments: validated.comments?.trim() || null,
        notes: validated.fullAddress?.trim() || null,
      },
    });

    return NextResponse.json(
      {
        message: "Lead submitted successfully! We'll analyze your information and get back to you shortly.",
        lead: newLead,
      },
      { status: 201 }
    )
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      const fieldErrors = error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }))
      return NextResponse.json(
        {
          message: "Please fix the following errors:",
          fieldErrors,
        },
        { status: 400 }
      )
    }

    // Handle unexpected errors
    console.error("Error creating lead:", error)
    return NextResponse.json(
      { message: "An error occurred while submitting your lead. Please try again.", error },
      { status: 500 }
    )
  }
}
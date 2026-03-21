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
  postCode: z.string().min(4, "Post code must be valid"),
  propertyType: z.string().min(1, "Property type is required"),
  roofType: z.string().min(1, "Roof type is required"),
  electricityBill: z.string().min(1, "Electricity bill is required"),
  comments: z.string().optional(),
})

export async function GET() {
  try {
    const leads = await prisma.leads.findMany({
      orderBy: { createdAt: "desc" },
    })

    const normalizedLeads = leads.map((lead) => ({
      id: lead.id,
      name: lead.name,
      email: lead.email,
      phoneNumber: lead.phoneNumber,
      postCode: lead.postCode,
      propertyType: lead.propertyType,
      roofType: lead.roofType,
      electricityBill: lead.electricityBill,
      comments: lead.comments,
      fullAddress: lead.fullAddress || lead.notes || lead.postCode,
      createdAt: lead.createdAt,
      status: lead.status,
      aiScore: lead.aiScore,
    }))

    return NextResponse.json({ leads: normalizedLeads }, { status: 200 })
  } catch (error) {
    console.error("Error fetching leads:", error)
    return NextResponse.json(
      { message: "An error occurred while fetching leads." },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate data
    const validated = leadSchema.parse(body)

    // Check for duplicate email
    const existingLead = await prisma.leads.findFirst({
      where: {
        email: validated.email,
      },
    })

    if (existingLead) {
      return NextResponse.json(
        { message: "A lead with this email already exists. Please use a different email." },
        { status: 409 }
      )
    }

    const providedAddress = validated.fullAddress?.trim() || ""
    const resolvedAddress = providedAddress || await resolveAddressFromPostcode(validated.postCode)

    // Create new lead in database
    const newLead = await prisma.leads.create({
      data: {
        name: validated.name,
        email: validated.email,
        phoneNumber: validated.phoneNumber,
        postCode: validated.postCode,
        propertyType: validated.propertyType,
        roofType: validated.roofType,
        electricityBill: validated.electricityBill,
        fullAddress: resolvedAddress || validated.postCode,
        comments: validated.comments?.trim() ? validated.comments : null,
        // Persist postcode-derived full address for admin UX and follow-up workflows.
        notes: resolvedAddress || validated.postCode,
      },
    })

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
      { message: "An error occurred while submitting your lead. Please try again." },
      { status: 500 }
    )
  }
}
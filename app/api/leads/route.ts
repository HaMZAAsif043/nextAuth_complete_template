import { NextRequest, NextResponse } from "next/server"
import  prisma  from "@/lib/prisma"
import { z } from "zod"

// Validate incoming lead data
const leadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  postCode: z.string().min(4, "Post code must be valid"),
  propertyType: z.string().min(1, "Property type is required"),
  roofType: z.string().min(1, "Roof type is required"),
  electricityBill: z.string().min(1, "Electricity bill is required"),
  comments: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    // Parse request body
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
        comments: validated.comments || null,
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
      return NextResponse.json(
        {
          message: "Validation error",
          errors: error
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
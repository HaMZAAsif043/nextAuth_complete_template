import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { z } from "zod"
import { error } from "console"
import bcrypt from "bcryptjs"


const schema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})
export async function POST(request: NextRequest) {
    try{
        const body = await request.json()
        const validatedData = schema.parse(body)
        if (validatedData){
            const { name, email, password } = validatedData;
            const findUser =await  prisma.user.findUnique({
                where:{
                    email: email
                }
            })
            if (findUser){
                return NextResponse.json(
                {error:"Email Already exists"}
                ,{status: 400})
            }
            const hashedPassword = await bcrypt.hash(password, 10)
            const user =await  prisma.user.create({
                data:{
                    name: name,
                    email:email,
                    password: hashedPassword
                }
            })
            return NextResponse.json({
                success:"Account Created Successful",
            status:200, user})
            
        }
    }
    catch(e){
        console.error("Error parsing request body:", e)
        return NextResponse.json({
            e,
            status:400
        })
    }
}
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Define validation schema
const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized. Only authenticated users can create new accounts." },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validationResult = userSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    
    const { name, username, password } = validationResult.data;
    
    console.log("Registration request received:", { name, username });

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Username already taken" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        name,
        password: hashedPassword,
      },
    });

    console.log("User created successfully:", { id: user.id });
    
    return NextResponse.json(
      { 
        message: "User registered successfully" 
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
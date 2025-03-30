import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { z } from "zod";

// Update the schema to enforce currency rules based on payment method
const donationSchema = z.object({
  donorName: z.string().optional(),
  amount: z.number().positive("Amount must be positive"),
  currency: z.enum(["MMK", "VND"]),
  method: z.enum(["KPay", "BIDV", "Cash", "Other"]),
  dateTime: z.string().or(z.date()).pipe(
    z.coerce.date({
      errorMap: () => ({ message: "Invalid date format" })
    })
  )
}).refine(data => {
  // KPay must use MMK
  if (data.method === "KPay" && data.currency !== "MMK") {
    return false;
  }
  // BIDV must use VND
  if (data.method === "BIDV" && data.currency !== "VND") {
    return false;
  }
  return true;
}, {
  message: "Currency must match payment method (KPay uses MMK, BIDV uses VND)",
  path: ["currency"]
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    // Parse and validate request body
    const body = await request.json();
    const validationResult = donationSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    
    const { donorName, amount, currency, method, dateTime } = validationResult.data;
    
    // Create donation record
    const donation = await prisma.transaction.create({
      data: {
        donorName,
        amount,
        currency,
        method,
        dateTime
      }
    });
    
    return NextResponse.json(
      { message: "Donation added successfully", donation },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error adding donation:", error);
    
    return NextResponse.json(
      { message: "Failed to add donation", error: error.message },
      { status: 500 }
    );
  }
}

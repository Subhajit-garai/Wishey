import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Please fill in all fields (name, email, password)",
        },
        { status: 400 }
      );
    }

    // 1. Check if email already registered
    const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "A user with this email already exists.",
        },
        { status: 400 }
      );
    }

    // 2. Set role to admin if email contains admin@ or ends with admin@wishey.com
    const role = email.toLowerCase().includes("admin") ? "admin" : "user";

    const newUser = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      email,
      password, // In production, hash password before saving
      role,
      createdAt: new Date().toISOString(),
    };

    await db.insert(users).values(newUser);

    return NextResponse.json({
      success: true,
      message: "Congratulations! You have signed up successfully.",
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Registration failed due to server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

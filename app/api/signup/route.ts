import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, createSessionToken, generateSecureId } from "@/lib/auth";

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
        { status: 400 },
      );
    }

    // 1. Check if email already registered
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (existing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "A user with this email already exists.",
        },
        { status: 400 },
      );
    }

    const hashedPassword = hashPassword(password);

    const newUser = {
      id: generateSecureId(),
      name,
      email,
      password: hashedPassword,
      role: "user",
      tokens: 3,
      createdAt: new Date().toISOString(),
    };

    await db.insert(users).values(newUser);

    const token = createSessionToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    const response = NextResponse.json({
      success: true,
      message:
        "Congratulations! You have signed up successfully. 3 creation tokens added!",
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        tokens: 3,
      },
    });

    response.cookies.set("wishey_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    response.cookies.set("wishey_user_role", newUser.role, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Registration failed due to server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

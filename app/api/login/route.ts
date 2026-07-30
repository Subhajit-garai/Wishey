import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword, createSessionToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter email and password",
        },
        { status: 400 }
      );
    }

    // 1. Find user
    const found = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (found.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Incorrect email or password.",
        },
        { status: 401 }
      );
    }

    const user = found[0];

    // 2. Match password using secure hash verification
    const passwordValid = verifyPassword(password, user.password);
    if (!passwordValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Incorrect email or password.",
        },
        { status: 401 }
      );
    }

    // 3. Generate signed session token
    const token = createSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // 4. Return user payload & set HttpOnly cookie
    const response = NextResponse.json({
      success: true,
      message: "Welcome back! Login successful.",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tokens: user.tokens ?? 3,
      },
    });

    // Set secure HttpOnly session cookie
    response.cookies.set("wishey_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    response.cookies.set("wishey_user_role", user.role, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Login failed due to server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

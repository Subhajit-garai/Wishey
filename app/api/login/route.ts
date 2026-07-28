import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

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

    // 2. Match password (plain check for simulation)
    if (user.password !== password) {
      return NextResponse.json(
        {
          success: false,
          message: "Incorrect email or password.",
        },
        { status: 401 }
      );
    }

    // 3. Return user payload
    const response = NextResponse.json({
      success: true,
      message: "Welcome back! Login successful.",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    // Set a mock user session cookie
    response.cookies.set("wishey_user_role", user.role, {
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
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

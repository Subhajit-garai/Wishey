import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

// GET /api/user/token?email=...
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Missing user email parameter" },
        { status: 400 }
      );
    }

    const found = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (found.length === 0) {
      return NextResponse.json({
        success: true,
        data: { tokens: 3 }, // Guest/Default fallback tokens
      });
    }

    return NextResponse.json({
      success: true,
      data: { tokens: found[0].tokens ?? 3 },
    });
  } catch (error) {
    console.error("GET /api/user/token error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch token count",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST /api/user/token - Add tokens after watching ad
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, amount = 1 } = body;

    if (!email) {
      return NextResponse.json(
        {
          success: true,
          message: `Earned ${amount} token!`,
          data: { tokens: 1 },
        }
      );
    }

    const found = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (found.length === 0) {
      return NextResponse.json({
        success: true,
        message: `Earned ${amount} token!`,
        data: { tokens: 1 },
      });
    }

    const updatedTokens = (found[0].tokens || 0) + amount;

    await db
      .update(users)
      .set({ tokens: updatedTokens })
      .where(eq(users.email, email));

    return NextResponse.json({
      success: true,
      message: `🎉 Success! +${amount} Creation Token added to your account!`,
      data: { tokens: updatedTokens },
    });
  } catch (error) {
    console.error("POST /api/user/token error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to reward tokens",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

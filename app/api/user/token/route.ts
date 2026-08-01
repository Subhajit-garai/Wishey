import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifySession } from "@/lib/auth";

// GET /api/user/token - Get creation token count for authenticated user
export async function GET(request: Request) {
  try {
    const session = await verifySession(request);
    if (!session.authenticated || !session.user) {
      return NextResponse.json(
        { success: false, message: session.message || "Authentication required" },
        { status: 401 }
      );
    }

    const found = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);

    if (found.length === 0) {
      return NextResponse.json({
        success: true,
        data: { tokens: 3 },
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

// POST /api/user/token - Add tokens after watching ad for authenticated user
export async function POST(request: Request) {
  try {
    const session = await verifySession(request);
    if (!session.authenticated || !session.user) {
      return NextResponse.json(
        { success: false, message: "Authentication required to earn tokens" },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const amount = Number(body.amount) || 1;

    const found = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);

    if (found.length === 0) {
      return NextResponse.json(
        { success: false, message: "User account not found" },
        { status: 404 }
      );
    }

    const updatedTokens = (found[0].tokens || 0) + amount;

    await db
      .update(users)
      .set({ tokens: updatedTokens })
      .where(eq(users.id, session.user.id));

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

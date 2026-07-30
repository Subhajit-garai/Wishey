import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await verifySession(request);
    if (!session.authenticated || !session.user) {
      return NextResponse.json(
        { success: false, message: session.message || "Not authenticated" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: session.user,
    });
  } catch (error) {
    console.error("GET /api/user/me error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch user session" },
      { status: 500 }
    );
  }
}

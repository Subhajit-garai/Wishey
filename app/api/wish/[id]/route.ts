import { NextResponse } from "next/server";
import { db } from "@/db";
import { wishes } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/wish/[id] - Fetch a single wish by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // In Next.js 15/16 params is a Promise
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing wish ID",
        },
        { status: 400 }
      );
    }

    const found = await db.select().from(wishes).where(eq(wishes.id, id)).limit(1);

    if (found.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Wish not found in database",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Fetched wish successfully",
      data: found[0],
    });
  } catch (error) {
    console.error("GET /api/wish/[id] error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch wish details",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

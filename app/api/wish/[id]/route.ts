import { NextResponse } from "next/server";
import { db } from "@/db";
import { wishes } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/wish/[id] - Fetch a single wish by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing wish ID" },
        { status: 400 }
      );
    }

    const found = await db.select().from(wishes).where(eq(wishes.id, id)).limit(1);

    if (found.length === 0) {
      return NextResponse.json(
        { success: false, message: "Wish not found in database" },
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

// PATCH /api/wish/[id] - Toggle isActive status
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { isActive } = body;

    if (!id || typeof isActive !== "boolean") {
      return NextResponse.json(
        { success: false, message: "Invalid parameters (id or isActive)" },
        { status: 400 }
      );
    }

    await db.update(wishes).set({ isActive }).where(eq(wishes.id, id));

    return NextResponse.json({
      success: true,
      message: `Wish status updated to ${isActive ? "Active" : "Inactive"}.`,
      data: { id, isActive },
    });
  } catch (error) {
    console.error("PATCH /api/wish/[id] error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update wish status",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/wish/[id] - Delete a wish
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing wish ID" },
        { status: 400 }
      );
    }

    await db.delete(wishes).where(eq(wishes.id, id));

    return NextResponse.json({
      success: true,
      message: "Wish deleted successfully.",
      data: { id },
    });
  } catch (error) {
    console.error("DELETE /api/wish/[id] error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete wish",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

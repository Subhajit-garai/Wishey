import { NextResponse } from "next/server";
import { db } from "@/db";
import { wishes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyAdminSession } from "@/lib/auth";

// DELETE /api/admin/wish/[id] - Allows administrators to delete inappropriate wishes
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 0. Server-side Authorization Check
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) {
      return NextResponse.json(
        {
          success: false,
          message: auth.message || "Unauthorized access",
        },
        { status: 403 }
      );
    }

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

    // Perform deletion
    const deleted = await db.delete(wishes).where(eq(wishes.id, id)).returning();

    if (deleted.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Wish card not found or already deleted",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Successfully deleted wish card from database",
      data: deleted[0],
    });
  } catch (error) {
    console.error("DELETE /api/admin/wish/[id] error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete wish card",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

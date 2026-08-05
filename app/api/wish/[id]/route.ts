import { NextResponse } from "next/server";
import { db } from "@/db";
import { wishes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifySession } from "@/lib/auth";

// GET /api/wish/[id] - Fetch a single wish by ID (Public if active, Owner/Admin if inactive)
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

    const wish = found[0];

    // If wish is inactive, verify user is owner or admin
    if (wish.isActive === false) {
      const session = await verifySession(request);
      const isOwner = session.authenticated && session.user?.email === wish.creatorEmail;
      const isAdmin = session.authenticated && session.user?.role === "admin";

      if (!isOwner && !isAdmin) {
        return NextResponse.json(
          { success: false, message: "Wish card is inactive." },
          { status: 403 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Fetched wish successfully",
      data: wish,
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

// PATCH /api/wish/[id] - Update wish details or toggle isActive status (Requires wish owner or admin)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await verifySession(request);
    if (!session.authenticated || !session.user) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing wish ID" },
        { status: 400 }
      );
    }

    // Verify existing wish ownership
    const found = await db.select().from(wishes).where(eq(wishes.id, id)).limit(1);
    if (found.length === 0) {
      return NextResponse.json(
        { success: false, message: "Wish not found" },
        { status: 404 }
      );
    }

    const wish = found[0];
    const isOwner = session.user.email === wish.creatorEmail;
    const isAdmin = session.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, message: "You do not have permission to modify this wish card" },
        { status: 403 }
      );
    }

    // If request contains only isActive (status toggle operation)
    if (typeof body.isActive === "boolean" && Object.keys(body).length === 1) {
      await db.update(wishes).set({ isActive: body.isActive }).where(eq(wishes.id, id));

      return NextResponse.json({
        success: true,
        message: `Wish status updated to ${body.isActive ? "Active" : "Inactive"}.`,
        data: { id, isActive: body.isActive },
      });
    }

    // Otherwise, perform partial/full wish update
    const updateData: Record<string, any> = {
      updatedAt: new Date().toISOString().split("T")[0],
    };

    const allowedFields = [
      "title",
      "subtitle",
      "description",
      "recipient",
      "sender",
      "messages",
      "quote",
      "poem",
      "coverImage",
      "profileImage",
      "gallery",
      "video",
      "voiceMessage",
      "music",
      "theme",
      "colors",
      "font",
      "animation",
      "memories",
      "timeline",
      "gifts",
      "countdown",
      "isPublic",
      "isActive",
      "allowComments",
      "allowReactions",
      "tags",
      "publishAt",
      "occasion",
      "templateId",
      "slug",
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    await db.update(wishes).set(updateData).where(eq(wishes.id, id));

    const updated = await db.select().from(wishes).where(eq(wishes.id, id)).limit(1);

    return NextResponse.json({
      success: true,
      message: "Wish updated successfully.",
      data: updated[0],
    });
  } catch (error) {
    console.error("PATCH /api/wish/[id] error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update wish",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/wish/[id] - Delete a wish (Requires wish owner or admin)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await verifySession(request);
    if (!session.authenticated || !session.user) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing wish ID" },
        { status: 400 }
      );
    }

    // Verify existing wish ownership
    const found = await db.select().from(wishes).where(eq(wishes.id, id)).limit(1);
    if (found.length === 0) {
      return NextResponse.json(
        { success: false, message: "Wish not found" },
        { status: 404 }
      );
    }

    const wish = found[0];
    const isOwner = session.user.email === wish.creatorEmail;
    const isAdmin = session.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, message: "You do not have permission to delete this wish card" },
        { status: 403 }
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

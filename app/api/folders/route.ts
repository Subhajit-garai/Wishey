import { NextResponse } from "next/server";
import { db } from "@/db";
import { folders, dates } from "@/db/schema";
import { verifySession, generateSecureId } from "@/lib/auth";
import { eq, and, sql } from "drizzle-orm";

// GET /api/folders - Fetch user's folders with date count
export async function GET(request: Request) {
  try {
    const session = await verifySession(request);
    if (!session.authenticated || !session.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const userFolders = await db
      .select({
        id: folders.id,
        name: folders.name,
        description: folders.description,
        createdAt: folders.createdAt,
        updatedAt: folders.updatedAt,
        dateCount: sql<number>`count(${dates.id})::int`,
      })
      .from(folders)
      .leftJoin(dates, eq(dates.folderId, folders.id))
      .where(eq(folders.userId, session.user.id))
      .groupBy(folders.id)
      .orderBy(folders.name);

    return NextResponse.json({ success: true, data: userFolders });
  } catch (error: any) {
    console.error("GET /api/folders error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to fetch folders" }, { status: 500 });
  }
}

// POST /api/folders - Create a new folder
export async function POST(request: Request) {
  try {
    const session = await verifySession(request);
    if (!session.authenticated || !session.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ success: false, error: "Folder name is required" }, { status: 400 });
    }

    const now = new Date().toISOString();
    const newFolder = {
      id: generateSecureId(),
      userId: session.user.id,
      name: name.trim(),
      description: description ? description.trim() : null,
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(folders).values(newFolder);

    return NextResponse.json({ success: true, data: newFolder }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/folders error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to create folder" }, { status: 500 });
  }
}

// PUT /api/folders - Update folder
export async function PUT(request: Request) {
  try {
    const session = await verifySession(request);
    if (!session.authenticated || !session.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, description } = body;

    if (!id || !name || !name.trim()) {
      return NextResponse.json({ success: false, error: "Folder ID and name are required" }, { status: 400 });
    }

    // Verify ownership
    const existing = await db
      .select()
      .from(folders)
      .where(and(eq(folders.id, id), eq(folders.userId, session.user.id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ success: false, error: "Folder not found" }, { status: 404 });
    }

    const now = new Date().toISOString();
    await db
      .update(folders)
      .set({
        name: name.trim(),
        description: description ? description.trim() : null,
        updatedAt: now,
      })
      .where(and(eq(folders.id, id), eq(folders.userId, session.user.id)));

    return NextResponse.json({ success: true, message: "Folder updated successfully" });
  } catch (error: any) {
    console.error("PUT /api/folders error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to update folder" }, { status: 500 });
  }
}

// DELETE /api/folders - Delete folder
export async function DELETE(request: Request) {
  try {
    const session = await verifySession(request);
    if (!session.authenticated || !session.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Folder ID is required" }, { status: 400 });
    }

    // Verify ownership
    const existing = await db
      .select()
      .from(folders)
      .where(and(eq(folders.id, id), eq(folders.userId, session.user.id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ success: false, error: "Folder not found" }, { status: 404 });
    }

    // Unlink dates in this folder
    await db
      .update(dates)
      .set({ folderId: null })
      .where(and(eq(dates.folderId, id), eq(dates.userId, session.user.id)));

    // Delete folder
    await db
      .delete(folders)
      .where(and(eq(folders.id, id), eq(folders.userId, session.user.id)));

    return NextResponse.json({ success: true, message: "Folder deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /api/folders error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to delete folder" }, { status: 500 });
  }
}

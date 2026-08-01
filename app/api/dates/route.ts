import { NextResponse } from "next/server";
import { db } from "@/db";
import { dates, folders } from "@/db/schema";
import { verifySession, generateSecureId } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { calculateDaysLeft } from "@/lib/date-utils";

// GET /api/dates - Fetch user's saved dates with calculated days left
export async function GET(request: Request) {
  try {
    const session = await verifySession(request);
    if (!session.authenticated || !session.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const folderIdFilter = searchParams.get("folderId");
    const search = searchParams.get("search")?.toLowerCase();

    // Fetch dates with left joined folder info
    let query = db
      .select({
        id: dates.id,
        name: dates.name,
        date: dates.date,
        folderId: dates.folderId,
        folderName: folders.name,
        relation: dates.relation,
        gender: dates.gender,
        specialRating: dates.specialRating,
        eventType: dates.eventType,
        notes: dates.notes,
        createdAt: dates.createdAt,
        updatedAt: dates.updatedAt,
      })
      .from(dates)
      .leftJoin(folders, eq(dates.folderId, folders.id))
      .where(eq(dates.userId, session.user.id));

    let rawDates = await query;

    // Apply folder filter if specified
    if (folderIdFilter && folderIdFilter !== "all") {
      if (folderIdFilter === "none") {
        rawDates = rawDates.filter((d) => !d.folderId);
      } else {
        rawDates = rawDates.filter((d) => d.folderId === folderIdFilter);
      }
    }

    // Apply search filter if specified
    if (search) {
      rawDates = rawDates.filter(
        (d) =>
          d.name.toLowerCase().includes(search) ||
          d.relation.toLowerCase().includes(search) ||
          (d.gender && d.gender.toLowerCase().includes(search)) ||
          (d.notes && d.notes.toLowerCase().includes(search))
      );
    }

    // Enhance each record with dynamic days left calculation
    const enhancedDates = rawDates.map((item) => {
      const calc = calculateDaysLeft(item.date);
      return {
        ...item,
        daysLeft: calc.daysLeft,
        isToday: calc.isToday,
        isTomorrow: calc.isTomorrow,
        badgeText: calc.badgeText,
        formattedNextOccurrence: calc.formattedNextOccurrence,
        formattedOriginalDate: calc.formattedOriginalDate,
        turningAge: calc.turningAge,
      };
    });

    // Default sort: nearest upcoming dates first (daysLeft ascending)
    enhancedDates.sort((a, b) => a.daysLeft - b.daysLeft);

    return NextResponse.json({ success: true, data: enhancedDates });
  } catch (error: any) {
    console.error("GET /api/dates error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to fetch dates" }, { status: 500 });
  }
}

// POST /api/dates - Create a new date record
export async function POST(request: Request) {
  try {
    const session = await verifySession(request);
    if (!session.authenticated || !session.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, date, folderId, relation, gender, specialRating, eventType, notes } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 });
    }

    if (!date || typeof date !== "string") {
      return NextResponse.json({ success: false, error: "Valid date is required" }, { status: 400 });
    }

    if (!relation || typeof relation !== "string" || !relation.trim()) {
      return NextResponse.json({ success: false, error: "Relation is required" }, { status: 400 });
    }

    const rating = Math.min(10, Math.max(1, parseInt(specialRating || 5, 10)));
    const now = new Date().toISOString();

    const newDateEntry = {
      id: generateSecureId(),
      userId: session.user.id,
      name: name.trim(),
      date: date.trim(),
      folderId: folderId && folderId !== "none" ? folderId : null,
      relation: relation.trim(),
      gender: gender ? gender.trim().toLowerCase() : "other",
      specialRating: rating,
      eventType: eventType || "birthday",
      notes: notes ? notes.trim() : null,
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(dates).values(newDateEntry);

    // Calculate days left for response
    const calc = calculateDaysLeft(newDateEntry.date);
    const responseData = {
      ...newDateEntry,
      daysLeft: calc.daysLeft,
      isToday: calc.isToday,
      isTomorrow: calc.isTomorrow,
      badgeText: calc.badgeText,
      formattedNextOccurrence: calc.formattedNextOccurrence,
      formattedOriginalDate: calc.formattedOriginalDate,
      turningAge: calc.turningAge,
    };

    return NextResponse.json({ success: true, data: responseData }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/dates error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to create date record" }, { status: 500 });
  }
}

// PUT /api/dates - Update an existing date record
export async function PUT(request: Request) {
  try {
    const session = await verifySession(request);
    if (!session.authenticated || !session.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, date, folderId, relation, gender, specialRating, eventType, notes } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Date ID is required" }, { status: 400 });
    }

    // Verify ownership
    const existing = await db
      .select()
      .from(dates)
      .where(and(eq(dates.id, id), eq(dates.userId, session.user.id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ success: false, error: "Date record not found" }, { status: 404 });
    }

    const rating = Math.min(10, Math.max(1, parseInt(specialRating || 5, 10)));
    const now = new Date().toISOString();

    await db
      .update(dates)
      .set({
        name: name ? name.trim() : existing[0].name,
        date: date ? date.trim() : existing[0].date,
        folderId: folderId !== undefined ? (folderId && folderId !== "none" ? folderId : null) : existing[0].folderId,
        relation: relation ? relation.trim() : existing[0].relation,
        gender: gender !== undefined ? (gender ? gender.trim().toLowerCase() : "other") : existing[0].gender,
        specialRating: rating,
        eventType: eventType || existing[0].eventType,
        notes: notes !== undefined ? (notes ? notes.trim() : null) : existing[0].notes,
        updatedAt: now,
      })
      .where(and(eq(dates.id, id), eq(dates.userId, session.user.id)));

    return NextResponse.json({ success: true, message: "Date record updated successfully" });
  } catch (error: any) {
    console.error("PUT /api/dates error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to update date record" }, { status: 500 });
  }
}

// DELETE /api/dates - Delete a date record
export async function DELETE(request: Request) {
  try {
    const session = await verifySession(request);
    if (!session.authenticated || !session.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Date ID is required" }, { status: 400 });
    }

    // Verify ownership
    const existing = await db
      .select()
      .from(dates)
      .where(and(eq(dates.id, id), eq(dates.userId, session.user.id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ success: false, error: "Date record not found" }, { status: 404 });
    }

    await db
      .delete(dates)
      .where(and(eq(dates.id, id), eq(dates.userId, session.user.id)));

    return NextResponse.json({ success: true, message: "Date record deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /api/dates error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to delete date record" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { db } from "@/db";
import { dates, folders } from "@/db/schema";
import { verifySession, generateSecureId } from "@/lib/auth";
import { eq } from "drizzle-orm";

interface BulkImportItem {
  name: string;
  date: string;
  relation?: string;
  gender?: string;
  specialRating?: number;
  folderName?: string;
  folderId?: string;
  eventType?: string;
  notes?: string;
}

// POST /api/dates/bulk-import - Bulk insert date entries from Excel/CSV import
export async function POST(request: Request) {
  try {
    const session = await verifySession(request);
    if (!session.authenticated || !session.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { items, defaultFolderId } = body as {
      items: BulkImportItem[];
      defaultFolderId?: string;
    };

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid date records provided" },
        { status: 400 }
      );
    }

    const userId = session.user.id;
    const now = new Date().toISOString();

    // 1. Fetch user's existing folders
    const userFolders = await db
      .select()
      .from(folders)
      .where(eq(folders.userId, userId));

    const folderMap = new Map<string, string>(); // lowerCaseName -> folderId
    userFolders.forEach((f) => {
      folderMap.set(f.name.toLowerCase().trim(), f.id);
    });

    let newlyCreatedFoldersCount = 0;

    // 2. Identify missing folder names and auto-create them
    for (const item of items) {
      if (item.folderName && typeof item.folderName === "string" && item.folderName.trim()) {
        const normalizedName = item.folderName.trim();
        const lowerName = normalizedName.toLowerCase();

        if (!folderMap.has(lowerName)) {
          const newFolderId = generateSecureId();
          const newFolder = {
            id: newFolderId,
            userId,
            name: normalizedName,
            description: "Auto-created from Excel import",
            createdAt: now,
            updatedAt: now,
          };

          await db.insert(folders).values(newFolder);
          folderMap.set(lowerName, newFolderId);
          newlyCreatedFoldersCount++;
        }
      }
    }

    // 3. Prepare dates records for insertion
    const validDatesToInsert = [];

    for (const item of items) {
      if (!item.name || !item.name.trim() || !item.date) {
        continue; // skip incomplete entries
      }

      let assignedFolderId: string | null = null;

      if (item.folderId && item.folderId !== "none") {
        assignedFolderId = item.folderId;
      } else if (item.folderName && typeof item.folderName === "string" && item.folderName.trim()) {
        const lowerName = item.folderName.trim().toLowerCase();
        assignedFolderId = folderMap.get(lowerName) || null;
      } else if (defaultFolderId && defaultFolderId !== "none") {
        assignedFolderId = defaultFolderId;
      }

      const rating = Math.min(10, Math.max(1, parseInt(String(item.specialRating || 5), 10)));
      const rel = item.relation && item.relation.trim() ? item.relation.trim() : "Friend";
      const gen = item.gender && item.gender.trim() ? item.gender.trim().toLowerCase() : "other";

      const rawEv = (item.eventType || "").trim().toLowerCase();
      let evType = "birthday";
      if (rawEv.includes("birth") || rawEv.includes("bday") || rawEv.includes("b-day")) {
        evType = "birthday";
      } else if (rawEv.includes("anniver") || rawEv.includes("wedding")) {
        evType = "anniversary";
      } else if (rawEv.includes("mile")) {
        evType = "milestone";
      } else if (rawEv) {
        evType = "other";
      }

      validDatesToInsert.push({
        id: generateSecureId(),
        userId,
        name: item.name.trim(),
        date: item.date.trim(),
        folderId: assignedFolderId,
        relation: rel,
        gender: gen,
        specialRating: rating,
        eventType: evType,
        notes: item.notes ? item.notes.trim() : null,
        createdAt: now,
        updatedAt: now,
      });
    }

    if (validDatesToInsert.length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid date rows could be imported" },
        { status: 400 }
      );
    }

    // 4. Batch insert into database
    await db.insert(dates).values(validDatesToInsert);

    return NextResponse.json({
      success: true,
      importedCount: validDatesToInsert.length,
      createdFoldersCount: newlyCreatedFoldersCount,
      message: `Successfully imported ${validDatesToInsert.length} date(s)!`,
    });
  } catch (error: any) {
    console.error("POST /api/dates/bulk-import error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to bulk import dates" },
      { status: 500 }
    );
  }
}

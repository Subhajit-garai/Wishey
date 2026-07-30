import { NextResponse } from "next/server";
import { db } from "@/db";
import { wishes, users } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { verifySession, generateSecureId } from "@/lib/auth";

// GET /api/wish - List wishes (filtered by email if provided)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    let query;
    if (email) {
      // Return user's specific wishes
      query = db.select().from(wishes).where(eq(wishes.creatorEmail, email)).orderBy(desc(wishes.createdAt));
    } else {
      // Return active public wishes
      query = db.select().from(wishes).where(eq(wishes.isActive, true)).orderBy(desc(wishes.createdAt));
    }

    const list = await query;

    return NextResponse.json({
      success: true,
      message: "Fetched wishes successfully",
      data: list,
    });
  } catch (error) {
    console.error("GET /api/wish error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch wishes",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST /api/wish - Create a new wish (requires authentication and costs 1 token)
export async function POST(request: Request) {
  try {
    // 1. Mandatory Session Verification
    const session = await verifySession(request);
    if (!session.authenticated || !session.user) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be logged in to create a wish card.",
          needLogin: true,
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    if (!body.title || !body.recipient?.name) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields (title or recipient name)",
        },
        { status: 400 }
      );
    }

    // 2. Token balance verification
    const userList = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
    if (userList.length === 0 || (userList[0].tokens ?? 0) < 1) {
      return NextResponse.json(
        {
          success: false,
          message: "Insufficient tokens! Please watch an ad to earn creation tokens.",
          needToken: true,
        },
        { status: 403 }
      );
    }

    // 3. Deduct 1 token
    const user = userList[0];
    await db
      .update(users)
      .set({ tokens: (user.tokens ?? 1) - 1 })
      .where(eq(users.id, session.user.id));

    // 4. Generate unguessable 128-bit UUID for wish card
    const wishId = generateSecureId();

    const newWish = {
      id: wishId,
      slug: body.slug || (body.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""),
      templateId: body.templateId || "default",
      occasion: body.occasion || "custom",
      title: body.title,
      subtitle: body.subtitle || null,
      description: body.description || null,
      recipient: body.recipient,
      sender: body.sender,
      messages: body.messages || [""],
      quote: body.quote || null,
      poem: body.poem || null,
      coverImage: body.coverImage || "/images/covers/default.jpg",
      profileImage: body.profileImage || null,
      gallery: body.gallery || [],
      video: body.video || null,
      voiceMessage: body.voiceMessage || null,
      music: body.music || null,
      theme: body.theme || "default",
      colors: body.colors || null,
      font: body.font || null,
      animation: body.animation || null,
      memories: body.memories || null,
      timeline: body.timeline || null,
      gifts: body.gifts || null,
      countdown: body.countdown || null,
      isPublic: body.isPublic !== undefined ? body.isPublic : true,
      isActive: true,
      creatorEmail: session.user.email,
      allowComments: body.allowComments !== undefined ? body.allowComments : true,
      allowReactions: body.allowReactions !== undefined ? body.allowReactions : true,
      views: body.views || 0,
      reactions: body.reactions || 0,
      shares: body.shares || 0,
      tags: body.tags || [],
      publishAt: body.publishAt || null,
      createdAt: body.createdAt || new Date().toISOString().split("T")[0],
      updatedAt: body.updatedAt || new Date().toISOString().split("T")[0],
    };

    await db.insert(wishes).values(newWish);

    return NextResponse.json({
      success: true,
      message: "Successfully created wish",
      data: newWish,
    });
  } catch (error) {
    console.error("POST /api/wish error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create wish",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

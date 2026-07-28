import { NextResponse } from "next/server";
import { db } from "@/db";
import { wishes } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

// GET /api/wish - List all wishes
export async function GET() {
  try {
    const list = await db.select().from(wishes).orderBy(desc(wishes.createdAt));
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

// POST /api/wish - Create a new wish
export async function POST(request: Request) {
  try {
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

    const newWish = {
      id: body.id || Math.random().toString(36).substring(2, 9),
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

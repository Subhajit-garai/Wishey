import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, wishes } from "@/db/schema";
import { sql, desc } from "drizzle-orm";

// GET /api/admin/stats - Retrieve overall app performance metrics
export async function GET() {
  try {
    // 1. Gather stats using SQL helper queries
    const totalUsersResult = await db.select({ count: sql<number>`count(*)` }).from(users);
    const totalWishesResult = await db.select({ count: sql<number>`count(*)` }).from(wishes);
    
    const sumResult = await db.select({
      views: sql<number>`sum(COALESCE(${wishes.views}, 0))`,
      reactions: sql<number>`sum(COALESCE(${wishes.reactions}, 0))`,
      shares: sql<number>`sum(COALESCE(${wishes.shares}, 0))`
    }).from(wishes);

    const allWishes = await db.select().from(wishes).orderBy(desc(wishes.createdAt));
    const allUsers = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt
    }).from(users).orderBy(desc(users.createdAt));

    return NextResponse.json({
      success: true,
      message: "Fetched stats successfully",
      data: {
        stats: {
          totalUsers: Number(totalUsersResult[0]?.count || 0),
          totalWishes: Number(totalWishesResult[0]?.count || 0),
          totalViews: Number(sumResult[0]?.views || 0),
          totalReactions: Number(sumResult[0]?.reactions || 0),
          totalShares: Number(sumResult[0]?.shares || 0)
        },
        wishes: allWishes,
        users: allUsers
      }
    });
  } catch (error) {
    console.error("GET /api/admin/stats error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch stats",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

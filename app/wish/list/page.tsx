import { verifySession } from "@/lib/auth";
import { db } from "@/db";
import { wishes } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { WishListClient } from "@/components/WishListClient";
import type { Wish } from "../types";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Created Wishes | Wishey",
  description: "Manage your created interactive digital wish cards on Wishey.",
};

export default async function WishlistPage() {
  const session = await verifySession();

  if (!session.authenticated || !session.user?.email) {
    redirect("/login?callbackUrl=/wish/list");
  }

  // Direct server-side data fetch — no HTTP waterfall or client-side loading flicker!
  const userWishes = (await db
    .select()
    .from(wishes)
    .where(eq(wishes.creatorEmail, session.user.email))
    .orderBy(desc(wishes.createdAt))) as unknown as Wish[];

  return (
    <WishListClient
      initialWishes={userWishes}
      currentUserEmail={session.user.email}
    />
  );
}

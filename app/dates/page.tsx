import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DatesDashboard } from "@/components/dates/DatesDashboard";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Close Ones & Important Dates | Wishey",
  description: "Track birthdays, anniversaries, and milestones for your close ones with countdowns and folders.",
};

export default async function DatesPage() {
  const session = await verifySession();

  if (!session.authenticated || !session.user) {
    redirect("/login?callbackUrl=/dates");
  }

  return (
    <DatesDashboard
      currentUserName={session.user.name}
      currentUserEmail={session.user.email}
    />
  );
}

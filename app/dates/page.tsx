import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DatesDashboard } from "@/components/dates/DatesDashboard";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Close Ones & Important Dates | Wishey",
  description:
    "Never miss a special day! Save birthdays, anniversaries, & milestones for your loved ones with live countdowns & folders on Wishey.",
  openGraph: {
    title: "Close Ones & Important Dates Tracker | Wishey",
    description:
      "Never miss a special day! Save birthdays, anniversaries, & milestones for your loved ones with live countdowns & folders on Wishey.",
    siteName: "Wishey",
    images: [
      {
        url: "/logo.svg",
        width: 1200,
        height: 630,
        alt: "Wishey Dates Tracker",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Close Ones & Important Dates Tracker | Wishey",
    description:
      "Never miss a special day! Save birthdays, anniversaries, & milestones for your loved ones with live countdowns & folders on Wishey.",
    images: ["/logo.svg"],
  },
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

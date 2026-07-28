"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { type Wish } from "../types";
import { WishTemplateRenderer } from "@/designs/wishtemplates";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Share2 } from "lucide-react";

// Predefined fallback mock database matching the created templateIds
const FALLBACK_WISHES: Record<string, Wish> = {
  "1": {
    id: "1",
    slug: "learn-typescript",
    templateId: "other-1", // Future Graduate
    occasion: "graduation",
    title: "Mastering TypeScript",
    subtitle: "A coding milestone achieved!",
    description: "Congratulations on conquering the type system! You can now write fully type-safe React components and Next.js APIs without breaking a sweat.",
    recipient: { name: "Subhajit", relation: "Friend" },
    sender: { name: "Wishey Team" },
    messages: ["Best of luck on your coding journey!", "TypeScript is awesome!", "Keep learning and building!"],
    coverImage: "/images/covers/graduation.jpg",
    theme: "emerald-gold",
    animation: { confetti: true, balloons: false, fireworks: true, floatingHearts: false, snow: false },
    isPublic: true,
    allowComments: true,
    allowReactions: true,
    views: 12,
    reactions: 4,
    shares: 1,
    createdAt: "2026-08-15",
    updatedAt: "2026-08-15"
  },
  "2": {
    id: "2",
    slug: "build-nextjs-app",
    templateId: "other-4", // Executive Climb
    occasion: "promotion",
    title: "Next.js 16 Fullstack App",
    subtitle: "Advanced routing masterclass",
    description: "You built and shipped a fully working dynamic application. Your modular directory structure and responsive components look world-class.",
    recipient: { name: "Subhajit", relation: "Developer" },
    sender: { name: "Wishey Team" },
    messages: ["Can't wait to see what you build next!", "Make it beautiful!", "The animations are super clean!"],
    coverImage: "/images/covers/nextjs.jpg",
    theme: "professional-blue",
    animation: { confetti: true, balloons: true, fireworks: false, floatingHearts: false, snow: false },
    isPublic: true,
    allowComments: true,
    allowReactions: true,
    views: 24,
    reactions: 8,
    shares: 3,
    createdAt: "2026-09-01",
    updatedAt: "2026-09-01"
  },
  "3": {
    id: "3",
    slug: "run-marathon",
    templateId: "birthday-5", // Cosmic Stardust
    occasion: "custom",
    title: "Completed the Marathon!",
    subtitle: "42km of pure focus",
    description: "You set a goal, trained for months, and crossed the finish line. An absolute display of pure willpower and dedication. Proud of you!",
    recipient: { name: "Jessica", relation: "Sister" },
    sender: { name: "Wishey Team" },
    messages: ["Stay strong! You got this!", "Hydrate well!", "Incredible pace!"],
    coverImage: "/images/covers/marathon.jpg",
    theme: "cosmic-blue",
    animation: { confetti: false, balloons: false, fireworks: true, floatingHearts: true, snow: false },
    isPublic: true,
    allowComments: true,
    allowReactions: true,
    views: 5,
    reactions: 2,
    shares: 0,
    createdAt: "2026-10-10",
    updatedAt: "2026-10-10"
  }
};

export default function WishSharedPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [wish, setWish] = useState<Wish | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;

    async function loadWish() {
      try {
        const response = await fetch(`/api/wish/${id}`);
        const result = await response.json();
        
        if (result.success && result.data) {
          setWish(result.data);
        } else {
          // Fallback to pre-written mock wishes if database fetch fails/returns 404
          if (FALLBACK_WISHES[id]) {
            setWish(FALLBACK_WISHES[id]);
          } else {
            toast.error("Wish card not found in database.");
          }
        }
      } catch (err) {
        console.error(err);
        // Network error fallback
        if (FALLBACK_WISHES[id]) {
          setWish(FALLBACK_WISHES[id]);
        } else {
          toast.error("Error loading wish card.");
        }
      } finally {
        setLoading(false);
      }
    }
    
    loadWish();
  }, [id]);

  useEffect(() => {
    if (wish?.title) {
      document.title = `${wish.title} | Wishey`;
    }
  }, [wish]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Share link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <p className="text-muted-foreground text-sm font-semibold">Loading wish card...</p>
      </div>
    );
  }

  if (!wish) {
    return (
      <div className="w-full min-h-screen bg-background flex flex-col items-center justify-center gap-4 text-center p-6">
        <h1 className="text-2xl font-bold">Wish Card Not Found</h1>
        <p className="text-muted-foreground max-w-sm">The link you followed might be broken or expired.</p>
        <Button onClick={() => router.push("/")} className="flex items-center gap-2">
          <Home className="w-4 h-4" /> Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen relative">
      {/* Floating control buttons overlay (visible only on hover / screen edge) */}
      <div className="fixed top-4 left-4 z-40 flex items-center gap-2 bg-neutral-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg text-white">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => router.push("/wish/list")}
          className="text-neutral-300 hover:text-white flex items-center gap-1 text-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <div className="w-px h-4 bg-neutral-700" />
        <Button
          size="sm"
          variant="ghost"
          onClick={handleShare}
          className="text-neutral-300 hover:text-white flex items-center gap-1 text-xs"
        >
          <Share2 className="w-4 h-4" /> Copy Link
        </Button>
      </div>

      {/* Renders the full screen template */}
      <WishTemplateRenderer wish={wish} />
    </div>
  );
}

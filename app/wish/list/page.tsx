"use client";

import { Card } from "@/designs/card";
import { type Wish } from "../types";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Calendar,
  User,
  Plus,
  MessageSquare,
  Gift,
  Heart,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Wishlist() {
  const router = useRouter();

  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    document.title = "My Wish Cards Registry | Wishey";

    async function loadWishes() {
      try {
        const response = await fetch("/api/wish");
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setWishes(result.data);
        } else {
          toast.error("Failed to load wishes from database.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Network error loading wishes.");
      } finally {
        setLoading(false);
      }
    }
    loadWishes();
  }, []);

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] p-4 md:p-10 max-w-7xl mx-auto flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground text-sm font-semibold">
            <Link
              href="/"
              className="hover:text-foreground flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
          </div>
          <h1 className="text-3xl font-black tracking-tight mt-1">
            Manage <span className="text-brand-gradient">Wishes</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            You have {wishes.length} active digital wish cards.
          </p>
        </div>

        <Button
          onClick={() => router.push("/wish/create")}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-gradient hover:opacity-90 text-white font-semibold shadow-brand border-0 cursor-pointer"
        >
          <Plus className="w-5 h-5" /> Create a Wish
        </Button>
      </div>

      {/* Wishes Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground text-sm font-semibold">Fetching wish cards from database...</p>
        </div>
      ) : wishes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
            <Gift className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold">No wishes created yet</h3>
          <p className="text-muted-foreground max-w-sm">
            Start spreading joy by designing your very first digital wish card
            today!
          </p>
          <Button onClick={() => router.push("/wish/create")} className="mt-2">
            Create Now
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {wishes.map((wish, index) => {
            // Assign different card variants/colors to create a dynamic grid look
            const variants: ("glass" | "gradient" | "neon" | "default")[] = [
              "glass",
              "gradient",
              "neon",
              "default",
            ];
            const cardVariant = variants[index % variants.length];

            // Assign decorative badge colors/icons
            const badgeIcons = [
              <Sparkles className="w-4 h-4 text-amber-500" key="sparkle" />,
              <Heart
                className="w-4 h-4 text-red-500 fill-red-500"
                key="heart"
              />,
              <Gift className="w-4 h-4 text-pink-500" key="gift" />,
            ];
            const icon = badgeIcons[index % badgeIcons.length];

            return (
              <Card
                key={wish.id}
                variant={cardVariant}
                glowColor={
                  cardVariant === "neon" ? "var(--primary)" : "var(--accent)"
                }
                className="flex flex-col justify-between h-80 relative"
                onClick={() => router.push(`/wish/${wish.id}`)}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-muted px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border border-border/40 capitalize">
                      {icon} {wish.occasion}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono bg-background/50 px-2 py-0.5 rounded border border-border/20">
                      ID: #{wish.id}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold line-clamp-1 mb-2 group-hover:text-primary transition-colors">
                    {wish.title}
                  </h3>

                  <p className="text-sm text-muted-foreground line-clamp-3 mb-6 leading-relaxed">
                    {wish.description}
                  </p>
                </div>

                <div className="border-t border-border/50 pt-4 mt-auto">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      <span>
                        To:{" "}
                        <strong className="text-foreground">
                          {wish.recipient.name}
                        </strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{wish.createdAt}</span>
                    </div>
                  </div>

                  {wish.messages && wish.messages.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-3 text-xs font-semibold text-primary/80 group-hover:text-primary transition-colors">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>
                        {wish.messages.filter((m) => m !== "").length} messages
                        attached
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

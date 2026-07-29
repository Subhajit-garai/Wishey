"use client";

import { Card } from "@/designs/card";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  FolderHeart,
  ArrowRight,
  Gift,
  Heart,
  Stars,
  Move,
} from "lucide-react";
import {
  DraggableCardBody,
  DraggableCardContainer,
} from "@/components/ui/draggable-card";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "birthday" | "anniversary" | "interactive"
  >("birthday");

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] p-4 md:p-10 flex flex-col xl:flex-row gap-10 max-w-7xl mx-auto">
      {/* Left Column: Quick Actions & Dashboard */}
      <div className="flex-1 flex flex-col gap-8 justify-center">
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            Create Magical <span className="text-brand-gradient">Wishes</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-lg leading-relaxed">
            Design and share personalized digital greeting cards with stunning
            visual effects, images, and heart-felt messages.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Create Wish Card */}
          <Card
            variant="gradient"
            glowColor="var(--primary)"
            className="p-8 h-72 flex flex-col justify-between"
            onClick={() => router.push("/wish/create")}
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-5 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Create a Wish</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Design a gorgeous, customized greeting card with custom images
                and messages.
              </p>
            </div>
            <div className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:translate-x-1 transition-transform">
              Start Designing <ArrowRight className="w-4 h-4" />
            </div>
          </Card>

          {/* Manage Wishes Card */}
          <Card
            variant="neon"
            glowColor="var(--accent)"
            className="p-8 h-72 flex flex-col justify-between"
            onClick={() => router.push("/wish/list")}
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-5 group-hover:scale-110 transition-transform duration-300">
                <FolderHeart className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Manage Wishes</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                View, edit, track, or share all your previously created wishes
                in one place.
              </p>
            </div>
            <div className="flex items-center gap-2 text-accent font-semibold text-sm group-hover:translate-x-1 transition-transform">
              View Dashboard <ArrowRight className="w-4 h-4" />
            </div>
          </Card>
        </div>
      </div>

      {/* Right Column: Live Card Showcase */}
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="w-full max-w-lg bg-white/40 dark:bg-black/20 backdrop-blur-md border border-border p-6 rounded-3xl shadow-xl flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Stars className="w-6 h-6 text-accent animate-pulse" />
              Live Previews
            </h2>
            {/* Tab Toggles */}
            <div className="flex bg-muted p-1 rounded-xl gap-1 text-xs font-semibold">
              <button
                onClick={() => setActiveTab("birthday")}
                className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === "birthday" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"}`}
              >
                Birthday
              </button>
              <button
                onClick={() => setActiveTab("anniversary")}
                className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === "anniversary" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"}`}
              >
                Anniversary
              </button>
              <button
                onClick={() => setActiveTab("interactive")}
                className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === "interactive" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"}`}
              >
                Interactive
              </button>
            </div>
          </div>

          <div className="min-h-[380px] flex items-center justify-center relative overflow-visible py-4">
            {activeTab === "birthday" && (
              <Card
                variant="gradient"
                glowColor="oklch(0.86 0.15 90)"
                className="w-full max-w-sm p-6 bg-linear-to-br from-yellow-100/90 to-pink-100/90 dark:from-yellow-950/40 dark:to-pink-950/40 border border-yellow-200/50"
              >
                <div className="flex justify-between items-start mb-6">
                  <span className="bg-yellow-400/20 text-yellow-800 dark:text-yellow-200 text-xs px-2.5 py-1 rounded-full font-bold">
                    🎂 Birthday Wish
                  </span>
                  <Gift className="w-5 h-5 text-pink-500 animate-bounce" />
                </div>
                <h4 className="text-2xl font-black text-pink-600 dark:text-pink-400 mb-2">
                  Happy Birthday!
                </h4>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6">
                  May your day be filled with lots of love, laughter, and cake!
                  Wishing you the happiest of birthdays.
                </p>
                <div className="border-t border-dashed border-neutral-300 dark:border-neutral-700 pt-4 flex justify-between items-center text-xs">
                  <span className="text-neutral-500 font-medium">
                    To: Sarah Jenkins
                  </span>
                  <span className="text-neutral-500 font-medium">
                    From: Wishey Team
                  </span>
                </div>
              </Card>
            )}

            {activeTab === "anniversary" && (
              <Card
                variant="glass"
                glowColor="oklch(0.74 0.16 340)"
                className="w-full max-w-sm p-6 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl" />
                <div className="flex justify-between items-start mb-6">
                  <span className="bg-pink-500/10 text-pink-600 dark:text-pink-400 text-xs px-2.5 py-1 rounded-full font-bold">
                    💖 Anniversary Wish
                  </span>
                  <Heart className="w-5 h-5 text-red-500 fill-red-500 animate-pulse" />
                </div>
                <h4 className="text-2xl font-extrabold text-neutral-800 dark:text-neutral-100 mb-2">
                  Happy Anniversary!
                </h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-6">
                  Wishing a beautiful couple a lifetime of love and happiness
                  together. Cheers to many more wonderful years!
                </p>
                <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 flex justify-between items-center text-xs">
                  <span className="text-neutral-500 font-medium">
                    To: Mark & Emma
                  </span>
                  <span className="text-neutral-500 font-medium">
                    Date: 28th July
                  </span>
                </div>
              </Card>
            )}

            {activeTab === "interactive" && (
              <DraggableCardContainer className="w-full flex items-center justify-center">
                <DraggableCardBody className="min-h-72 w-80 bg-neutral-50/90 dark:bg-neutral-900/90 border border-border shadow-2xl flex flex-col justify-between p-6">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <Move className="w-3 h-3" /> Draggable Card
                      </span>
                    </div>
                    <h4 className="text-xl font-bold mb-2">Drag Me Around!</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      This card uses Framer Motion physics and 3D tilting! Drag
                      it anywhere on the screen or hover to tilt it.
                    </p>
                  </div>
                  <div className="text-[10px] text-center text-muted-foreground border-t border-border/50 pt-3">
                    Bounces back when you grab & release it!
                  </div>
                </DraggableCardBody>
              </DraggableCardContainer>
            )}
          </div>
          <p className="text-center text-xs text-muted-foreground italic">
            Click on tabs to switch designs. Try hovering or dragging the cards!
          </p>
        </div>
      </div>
    </div>
  );
}

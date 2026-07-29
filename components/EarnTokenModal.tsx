"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AdBanner } from "@/components/AdBanner";
import { Coins, Sparkles, Play, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface EarnTokenModalProps {
  userEmail?: string;
  onTokenEarned?: (newCount: number) => void;
  triggerText?: string;
  variant?: "button" | "card";
}

export const EarnTokenModal = ({
  userEmail,
  onTokenEarned,
  triggerText = "Earn Free Token (+1 🪙)",
  variant = "button",
}: EarnTokenModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isWatching, setIsWatching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [earned, setEarned] = useState(false);

  const handleWatchAd = async () => {
    setIsWatching(true);
    setProgress(0);
    setEarned(false);

    // Simulate 5-second ad viewing experience
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 20;
      });
    }, 800);

    setTimeout(async () => {
      try {
        const storedUser = localStorage.getItem("wishey_user");
        const email = userEmail || (storedUser ? JSON.parse(storedUser).email : null);

        const res = await fetch("/api/user/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, amount: 1 }),
        });

        const data = await res.json();
        if (data.success) {
          setEarned(true);
          toast.success(data.message || "Earned +1 Wish Creation Token!");

          // Update local stored user token count if applicable
          if (storedUser) {
            const parsed = JSON.parse(storedUser);
            parsed.tokens = (parsed.tokens || 0) + 1;
            localStorage.setItem("wishey_user", JSON.stringify(parsed));
          }

          if (onTokenEarned) {
            onTokenEarned(data.data?.tokens || 1);
          }
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to credit token.");
      } finally {
        setIsWatching(false);
      }
    }, 4500);
  };

  return (
    <>
      {variant === "button" ? (
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          className="gap-2 border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 cursor-pointer font-bold"
        >
          <Coins className="w-4 h-4 text-amber-500 animate-pulse" />
          {triggerText}
        </Button>
      ) : (
        <div className="p-6 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-background to-purple-500/10 text-center flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
            <Coins className="w-6 h-6 animate-bounce" />
          </div>
          <h3 className="font-bold text-lg">Need Creation Tokens?</h3>
          <p className="text-xs text-muted-foreground max-w-xs">
            Watch a quick sponsored ad to instantly earn 1 Wish Creation Token!
          </p>
          <Button
            onClick={() => setIsOpen(true)}
            className="bg-amber-500 hover:bg-amber-600 text-black font-extrabold gap-2 cursor-pointer shadow-md"
          >
            <Sparkles className="w-4 h-4" /> Watch Ad for +1 Token
          </Button>
        </div>
      )}

      {/* Modal Dialog Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl relative flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-base">Watch Ad to Earn Token</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-bold p-1 rounded-full hover:bg-muted cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Ad Container Box */}
            <div className="my-2 border border-dashed border-border rounded-xl p-4 bg-muted/20 min-h-[160px] flex flex-col items-center justify-center text-center">
              <AdBanner />
            </div>

            {/* Progress / Reward Status */}
            {isWatching ? (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground font-semibold">
                  <span>Watching Sponsored Ad...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-amber-500 h-2.5 transition-all duration-300 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : earned ? (
              <div className="flex items-center justify-center gap-2 text-green-500 font-bold text-sm bg-green-500/10 p-3 rounded-xl">
                <CheckCircle2 className="w-5 h-5" /> Token Added Successfully!
              </div>
            ) : null}

            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleWatchAd}
                disabled={isWatching}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-extrabold gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-black" />
                {isWatching ? "Watching Ad..." : "Claim 1 Token"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isWatching}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EarnTokenModal;

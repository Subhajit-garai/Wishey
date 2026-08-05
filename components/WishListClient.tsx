"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { type Wish } from "@/app/wish/types";
import { Card } from "@/designs/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EarnTokenModal } from "@/components/EarnTokenModal";
import { toast } from "sonner";
import Link from "next/link";
import {
  Calendar,
  User,
  Plus,
  MessageSquare,
  Gift,
  Heart,
  Sparkles,
  ArrowLeft,
  Trash2,
  Power,
  ExternalLink,
  Pencil,
  Copy,
  X,
} from "lucide-react";

interface WishListClientProps {
  initialWishes: Wish[];
  currentUserName?: string;
  currentUserEmail?: string;
}

export function WishListClient({ initialWishes, currentUserName, currentUserEmail }: WishListClientProps) {
  const router = useRouter();
  const [wishes, setWishes] = useState<Wish[]>(initialWishes);

  // Copy wish state
  const [copyingWish, setCopyingWish] = useState<Wish | null>(null);
  const [newRecipientName, setNewRecipientName] = useState<string>("");
  const [isCopying, setIsCopying] = useState<boolean>(false);

  const handleToggleActive = async (e: React.MouseEvent, wishId: string, currentStatus: boolean = true) => {
    e.stopPropagation();
    try {
      const nextStatus = !currentStatus;
      const res = await fetch(`/api/wish/${wishId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setWishes((prev) =>
          prev.map((w) => (w.id === wishId ? { ...w, isActive: nextStatus } : w))
        );
        toast.success(`Wish card ${nextStatus ? "Activated" : "Deactivated"}`);
      } else {
        toast.error(data.message || "Failed to update status.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to toggle active status.");
    }
  };

  const handleDeleteWish = async (e: React.MouseEvent, wishId: string) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this wish card permanently?")) {
      return;
    }

    try {
      const res = await fetch(`/api/wish/${wishId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setWishes((prev) => prev.filter((w) => w.id !== wishId));
        toast.success("Wish card deleted successfully.");
      } else {
        toast.error(data.message || "Failed to delete wish.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete wish card.");
    }
  };

  const handleOpenCopyModal = (e: React.MouseEvent, wish: Wish) => {
    e.stopPropagation();
    setCopyingWish(wish);
    setNewRecipientName("");
  };

  const handleConfirmCopy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!copyingWish) return;
    if (!newRecipientName.trim()) {
      toast.error("Please enter a recipient name.");
      return;
    }

    setIsCopying(true);
    const toastId = toast.loading(`Copying wish card for ${newRecipientName}...`);

    try {
      // Auto replace recipient name in title if applicable
      let updatedTitle = copyingWish.title;
      if (copyingWish.recipient?.name && copyingWish.title.includes(copyingWish.recipient.name)) {
        updatedTitle = copyingWish.title.replace(copyingWish.recipient.name, newRecipientName.trim());
      }

      const copiedPayload = {
        ...copyingWish,
        id: undefined, // Generate new UUID in API
        title: updatedTitle,
        recipient: {
          ...copyingWish.recipient,
          name: newRecipientName.trim(),
        },
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      };

      const res = await fetch("/api/wish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(copiedPayload),
      });

      const data = await res.json();

      if (data.success && data.data) {
        setWishes((prev) => [data.data, ...prev]);

        // Deduct 1 token locally
        const storedUser = localStorage.getItem("wishey_user");
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            parsed.tokens = Math.max(0, (parsed.tokens || 1) - 1);
            localStorage.setItem("wishey_user", JSON.stringify(parsed));
          } catch {}
        }

        toast.success(`Copied wish card for "${newRecipientName.trim()}" (1 🪙 deducted)!`, {
          id: toastId,
        });
        setCopyingWish(null);
      } else if (data.needToken) {
        toast.error("Insufficient Tokens! Please click 'Watch Ad' to earn tokens.", { id: toastId });
      } else {
        toast.error(data.message || "Failed to copy wish card.", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to copy wish card.", { id: toastId });
    } finally {
      setIsCopying(false);
    }
  };

  const displayName = currentUserName || currentUserEmail;

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] p-4 md:p-10 max-w-7xl mx-auto flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground text-sm font-semibold">
            <Link
              href="/"
              className="hover:text-foreground flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
            My Created <span className="text-brand-gradient">Wishes</span>
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm">
            {displayName ? (
              <>Showing created wish cards for <strong>{displayName}</strong>.</>
            ) : (
              <>Showing all active digital wish cards.</>
            )}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
          <EarnTokenModal userEmail={currentUserEmail} />
          <Button
            onClick={() => router.push("/wish/create")}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-gradient hover:opacity-90 text-white font-semibold shadow-brand border-0 cursor-pointer"
          >
            <Plus className="w-5 h-5 shrink-0" />
            <span>Create a Wish (1 🪙)</span>
          </Button>
        </div>
      </div>

      {/* Wishes Grid */}
      {wishes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
            <Gift className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold">No wish cards created yet</h3>
          <p className="text-muted-foreground max-w-sm">
            Start spreading joy by designing your very first digital wish card today!
          </p>
          <Button onClick={() => router.push("/wish/create")} className="mt-2">
            Create Now (1 🪙)
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishes.map((wish, index) => {
            const isWishActive = wish.isActive !== false;
            const variants: ("glass" | "gradient" | "neon" | "default")[] = [
              "glass",
              "gradient",
              "neon",
              "default",
            ];
            const cardVariant = variants[index % variants.length];

            const badgeIcons = [
              <Sparkles className="w-4 h-4 text-amber-500" key="sparkle" />,
              <Heart className="w-4 h-4 text-red-500 fill-red-500" key="heart" />,
              <Gift className="w-4 h-4 text-pink-500" key="gift" />,
            ];
            const icon = badgeIcons[index % badgeIcons.length];

            return (
              <Card
                key={wish.id}
                variant={cardVariant}
                glowColor={cardVariant === "neon" ? "var(--primary)" : "var(--accent)"}
                className={`flex flex-col justify-between h-[360px] relative transition-all ${
                  !isWishActive ? "opacity-60 grayscale-[30%]" : ""
                }`}
              >
                <div>
                  {/* Top Bar with Badge, Controls */}
                  <div className="flex justify-between items-center mb-3">
                    <span className="bg-muted px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border border-border/40 capitalize">
                      {icon} {wish.occasion}
                    </span>

                    {/* Action Controls: Toggle Active, Edit, Copy, Delete */}
                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => handleToggleActive(e, wish.id, wish.isActive)}
                        title={isWishActive ? "Click to Deactivate Wish" : "Click to Activate Wish"}
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-colors border ${
                          isWishActive
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                            : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 hover:bg-rose-500/20"
                        }`}
                      >
                        <Power className="w-3 h-3" />
                        {isWishActive ? "Active" : "Inactive"}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/wish/${wish.id}/edit`);
                        }}
                        title="Edit Wish Card"
                        className="p-1.5 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => handleOpenCopyModal(e, wish)}
                        title="Copy Wish (Create with new name)"
                        className="p-1.5 rounded-full text-muted-foreground hover:text-sky-500 hover:bg-sky-500/10 transition-colors cursor-pointer"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => handleDeleteWish(e, wish.id)}
                        title="Delete Wish Card"
                        className="p-1.5 rounded-full text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold line-clamp-1 mb-2 group-hover:text-primary transition-colors">
                    {wish.title}
                  </h3>

                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
                    {wish.description || "Interactive digital wishing card created on Wishey."}
                  </p>
                </div>

                <div className="border-t border-border/50 pt-4 mt-auto space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      <span>
                        To: <strong className="text-foreground">{wish.recipient.name}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{wish.createdAt}</span>
                    </div>
                  </div>

                  {wish.messages && wish.messages.length > 0 && (
                    <div className="flex items-center justify-between text-xs font-semibold text-primary/80">
                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{wish.messages.filter((m) => m !== "").length} messages attached</span>
                      </div>
                    </div>
                  )}

                  {/* Card View Link Button */}
                  <Button
                    onClick={() => router.push(`/wish/${wish.id}`)}
                    variant="outline"
                    size="sm"
                    className="w-full mt-3 flex items-center justify-center gap-1.5 cursor-pointer font-bold"
                  >
                    <span>View Wish Card</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* COPY WISH MODAL */}
      {copyingWish && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative flex flex-col gap-6">
            <button
              onClick={() => setCopyingWish(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1.5 rounded-full hover:bg-muted transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sky-500 font-bold text-sm">
                <Copy className="w-4 h-4" /> Duplicate Wish Card
              </div>
              <h2 className="text-xl font-extrabold tracking-tight">Copy Wish</h2>
              <p className="text-xs text-muted-foreground">
                Create a new wish card using this design and messages. Simply update the recipient name below.
              </p>
            </div>

            <form onSubmit={handleConfirmCopy} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="copy-name" className="font-bold text-sm">
                  New Recipient Name *
                </Label>
                <Input
                  id="copy-name"
                  value={newRecipientName}
                  onChange={(e) => setNewRecipientName(e.target.value)}
                  placeholder="e.g. John Doe"
                  required
                  autoFocus
                  className="rounded-xl"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-muted/50 border border-border/60 text-xs space-y-1 text-muted-foreground">
                <p>
                  <strong>Original Wish:</strong> &quot;{copyingWish.title}&quot;
                </p>
                <p>
                  <strong>Occasion:</strong> {copyingWish.occasion} | <strong>Theme:</strong> {copyingWish.theme}
                </p>
                <p className="text-primary font-medium mt-1">Cost: 1 Token (🪙)</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCopyingWish(null)}
                  disabled={isCopying}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isCopying}
                  className="bg-brand-gradient text-white font-bold cursor-pointer"
                >
                  {isCopying ? "Copying..." : "Create Wish Copy (1 🪙)"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


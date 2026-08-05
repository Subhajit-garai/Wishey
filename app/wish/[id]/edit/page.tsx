"use client";

import { Card } from "@/designs/card/Card";
import { type Wish } from "@/app/wish/types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sparkles,
  User,
  Plus,
  Trash,
  ChevronRight,
  ChevronLeft,
  Smile,
  ArrowLeft,
  Eye,
  X,
  Save,
  Pencil,
} from "lucide-react";
import Link from "next/link";

export default function WishEditPage() {
  const router = useRouter();
  const params = useParams();
  const wishId = params?.id as string;

  const [loading, setLoading] = useState<boolean>(true);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [wishForm, setWishForm] = useState<Wish | null>(null);
  const [previewWish, setPreviewWish] = useState<Wish | null>(null);

  useEffect(() => {
    if (!wishId) return;

    async function fetchWish() {
      try {
        setLoading(true);
        const res = await fetch(`/api/wish/${wishId}`);
        const result = await res.json();
        if (result.success && result.data) {
          setWishForm(result.data);
          document.title = `Edit "${result.data.title}" | Wishey`;
        } else {
          toast.error(result.message || "Failed to load wish card for editing.");
          router.push("/wish/list");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load wish details.");
        router.push("/wish/list");
      } finally {
        setLoading(false);
      }
    }

    fetchWish();
  }, [wishId, router]);

  // Helper to handle text fields
  const updateTextField = (path: string, val: any) => {
    if (!wishForm) return;
    setWishForm((prev) => {
      if (!prev) return prev;
      const keys = path.split(".");
      if (keys.length === 2) {
        const parentKey = keys[0] as keyof Wish;
        return {
          ...prev,
          [parentKey]: {
            ...(prev[parentKey] as any),
            [keys[1]]: val,
          },
        };
      }
      return {
        ...prev,
        [path]: val,
      };
    });
  };

  // Handle multiple messages updating
  const handleMessageChange = (index: number, val: string) => {
    if (!wishForm) return;
    setWishForm((prev) => {
      if (!prev) return prev;
      const updatedMessages = [...prev.messages];
      updatedMessages[index] = val;
      return {
        ...prev,
        messages: updatedMessages,
      };
    });
  };

  const addMessageField = () => {
    if (!wishForm) return;
    setWishForm((prev) => ({
      ...prev!,
      messages: [...prev!.messages, ""],
    }));
  };

  const removeMessageField = (index: number) => {
    if (!wishForm || wishForm.messages.length <= 1) return;
    setWishForm((prev) => {
      if (!prev) return prev;
      const updated = [...prev.messages];
      updated.splice(index, 1);
      return {
        ...prev,
        messages: updated,
      };
    });
  };

  // Save changes
  const handleUpdateWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishForm) return;
    if (!wishForm.title || !wishForm.recipient.name) {
      toast.error("Please fill in the Wish Title and Recipient Name.");
      return;
    }

    const toastId = toast.loading("Updating your digital wish card...");

    try {
      const response = await fetch(`/api/wish/${wishId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(wishForm),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Wish card updated successfully!", { id: toastId });
        router.refresh();
        router.push("/wish/list");
      } else {
        toast.error(result.message || "Failed to update wish in database.", {
          id: toastId,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error. Please try again.", { id: toastId });
    }
  };

  if (loading || !wishForm) {
    return (
      <div className="w-full min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <p className="text-muted-foreground text-sm font-semibold">Loading wish card for editing...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] p-4 md:p-10 max-w-7xl mx-auto flex flex-col gap-8">
      {/* Header section */}
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div className="space-y-1">
          <Link
            href="/wish/list"
            className="text-muted-foreground text-sm font-semibold hover:text-foreground flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> Back to My Wishes
          </Link>
          <h1 className="text-3xl font-black tracking-tight mt-1 flex items-center gap-2">
            <Pencil className="w-7 h-7 text-primary" /> Edit <span className="text-brand-gradient">Wish</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Updating wish card for <strong>{wishForm.recipient.name}</strong> (Step {currentStep} of 3)
          </p>
        </div>
      </div>

      {/* STEP 1: Recipient and Sender Info */}
      {currentStep === 1 && (
        <div className="max-w-2xl mx-auto w-full bg-white/40 dark:bg-black/20 border border-border rounded-3xl p-6 md:p-8 shadow-xl flex flex-col gap-6">
          <h2 className="text-xl font-bold flex items-center gap-2 border-b border-border pb-3">
            <User className="text-primary w-5 h-5" /> Step 1: Recipient & Sender Information
          </h2>

          <div className="grid gap-6">
            {/* Recipient info */}
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold text-primary uppercase tracking-wider">
                Recipient Info
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="rec-name">Recipient Name *</Label>
                  <Input
                    id="rec-name"
                    value={wishForm.recipient.name}
                    onChange={(e) => updateTextField("recipient.name", e.target.value)}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rec-nick">Nickname</Label>
                  <Input
                    id="rec-nick"
                    value={wishForm.recipient.nickname || ""}
                    onChange={(e) => updateTextField("recipient.nickname", e.target.value)}
                    placeholder="e.g. Champ, Sis"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="rec-relation">Relation</Label>
                  <Input
                    id="rec-relation"
                    value={wishForm.recipient.relation || ""}
                    onChange={(e) => updateTextField("recipient.relation", e.target.value)}
                    placeholder="e.g. Best Friend, Mother, Colleague"
                  />
                </div>
              </div>
            </div>

            {/* Sender info */}
            <div className="space-y-4 border-t border-border/50 pt-6">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-extrabold text-primary uppercase tracking-wider">
                  Sender Info
                </h3>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="send-anon"
                    checked={wishForm.sender.anonymous || false}
                    onCheckedChange={(checked) => updateTextField("sender.anonymous", !!checked)}
                  />
                  <Label htmlFor="send-anon" className="cursor-pointer text-xs font-semibold">
                    Send anonymously
                  </Label>
                </div>
              </div>

              {!wishForm.sender.anonymous && (
                <div className="space-y-2">
                  <Label htmlFor="send-name">Your Name</Label>
                  <Input
                    id="send-name"
                    value={wishForm.sender.name}
                    onChange={(e) => updateTextField("sender.name", e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Stepper Navigation */}
          <div className="flex justify-end pt-6 border-t border-border mt-4">
            <Button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="flex items-center gap-1.5 bg-primary text-primary-foreground font-bold shadow-md cursor-pointer"
            >
              Continue to Content <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: Customize Message and Content */}
      {currentStep === 2 && (
        <div className="max-w-3xl mx-auto w-full bg-white/40 dark:bg-black/20 border border-border rounded-3xl p-6 md:p-8 shadow-xl flex flex-col gap-6">
          <h2 className="text-xl font-bold flex items-center gap-2 border-b border-border pb-3">
            <Smile className="text-primary w-5 h-5" /> Step 2: Card Content & Messages
          </h2>

          <div className="grid gap-6">
            <div className="space-y-2">
              <Label htmlFor="card-title">Wish Card Title *</Label>
              <Input
                id="card-title"
                value={wishForm.title}
                onChange={(e) => updateTextField("title", e.target.value)}
                placeholder="e.g. Happy Birthday, Superstar!"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="card-sub">Subtitle (Tagline)</Label>
              <Input
                id="card-sub"
                value={wishForm.subtitle || ""}
                onChange={(e) => updateTextField("subtitle", e.target.value)}
                placeholder="e.g. Wishing you a year as bright as your smile"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="card-desc">Description</Label>
              <Textarea
                id="card-desc"
                value={wishForm.description || ""}
                onChange={(e) => updateTextField("description", e.target.value)}
                placeholder="Write a warm note of appreciation or celebration..."
                rows={4}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="card-quote">Inspiring Quote</Label>
                <Input
                  id="card-quote"
                  value={wishForm.quote || ""}
                  onChange={(e) => updateTextField("quote", e.target.value)}
                  placeholder="e.g. Count your life by smiles..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="card-poem">Short Poem / Rhyme</Label>
                <Textarea
                  id="card-poem"
                  value={wishForm.poem || ""}
                  onChange={(e) => updateTextField("poem", e.target.value)}
                  placeholder="A year of dreams, a year of cheer..."
                  rows={2}
                />
              </div>
            </div>

            {/* List of custom messages */}
            <div className="space-y-4 border-t border-border/50 pt-6">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-extrabold text-primary uppercase tracking-wider">
                  Messages List
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addMessageField}
                  className="flex items-center gap-1 text-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Message
                </Button>
              </div>

              <div className="space-y-3">
                {wishForm.messages.map((msg, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <Textarea
                      value={msg}
                      onChange={(e) => handleMessageChange(index, e.target.value)}
                      placeholder={`Message #${index + 1}`}
                      rows={2}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMessageField(index)}
                      disabled={wishForm.messages.length <= 1}
                      className="text-destructive hover:bg-destructive/10 shrink-0 mt-1 cursor-pointer"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stepper Navigation */}
          <div className="flex justify-between pt-6 border-t border-border mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(1)}
              className="flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" /> Back to Step 1
            </Button>
            <Button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="flex items-center gap-1.5 bg-primary text-primary-foreground font-bold shadow-md cursor-pointer"
            >
              Continue to Styling <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: Style, Animations and Save */}
      {currentStep === 3 && (
        <form
          onSubmit={handleUpdateWish}
          className="max-w-3xl mx-auto w-full bg-white/40 dark:bg-black/20 border border-border rounded-3xl p-6 md:p-8 shadow-xl flex flex-col gap-6"
        >
          <h2 className="text-xl font-bold flex items-center gap-2 border-b border-border pb-3">
            <Sparkles className="text-primary w-5 h-5" /> Step 3: Styling, Effects & Save
          </h2>

          <div className="grid gap-6">
            {/* Visual styling preset */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="style-theme">Visual Theme Name</Label>
                <Input
                  id="style-theme"
                  value={wishForm.theme}
                  onChange={(e) => updateTextField("theme", e.target.value)}
                  placeholder="e.g. glass-purple, dark-gold, modern"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="style-font">Custom Font Family</Label>
                <Input
                  id="style-font"
                  value={wishForm.font || ""}
                  onChange={(e) => updateTextField("font", e.target.value)}
                  placeholder="e.g. var(--font-geist-mono), Playfair"
                />
              </div>
            </div>

            {/* Animation toggles */}
            <div className="space-y-3 border-t border-border/50 pt-6">
              <Label className="text-sm font-extrabold text-primary uppercase tracking-wider block">
                Special Effects & Animations
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-muted/30 p-4 rounded-2xl border border-border/40">
                {(
                  [
                    { key: "confetti", label: "🎉 Confetti" },
                    { key: "balloons", label: "🎈 Balloons" },
                    { key: "fireworks", label: "🎆 Fireworks" },
                    { key: "floatingHearts", label: "💖 Floating Hearts" },
                    { key: "snow", label: "❄️ Snowfall" },
                  ] as const
                ).map((anim) => (
                  <div key={anim.key} className="flex items-center gap-2">
                    <Checkbox
                      id={`anim-${anim.key}`}
                      checked={wishForm.animation?.[anim.key] || false}
                      onCheckedChange={(checked) => {
                        setWishForm((prev) => ({
                          ...prev!,
                          animation: {
                            ...(prev!.animation || {}),
                            [anim.key]: !!checked,
                          },
                        }));
                      }}
                    />
                    <Label htmlFor={`anim-${anim.key}`} className="cursor-pointer text-xs font-semibold">
                      {anim.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Countdown timer */}
            <div className="space-y-4 border-t border-border/50 pt-6">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-extrabold text-primary uppercase tracking-wider">
                  Countdown Clock
                </Label>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="cd-enabled"
                    checked={wishForm.countdown?.enabled || false}
                    onCheckedChange={(checked) => {
                      setWishForm((prev) => ({
                        ...prev!,
                        countdown: {
                          enabled: !!checked,
                          targetDate: prev!.countdown?.targetDate || "",
                        },
                      }));
                    }}
                  />
                  <Label htmlFor="cd-enabled" className="cursor-pointer text-xs font-semibold">
                    Enable countdown
                  </Label>
                </div>
              </div>

              {wishForm.countdown?.enabled && (
                <div className="space-y-2">
                  <Label htmlFor="cd-date">Target Unlock Date & Time</Label>
                  <Input
                    id="cd-date"
                    type="datetime-local"
                    value={wishForm.countdown?.targetDate || ""}
                    onChange={(e) => {
                      setWishForm((prev) => ({
                        ...prev!,
                        countdown: {
                          enabled: true,
                          targetDate: e.target.value,
                        },
                      }));
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Stepper Navigation */}
          <div className="flex justify-between pt-6 border-t border-border mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(2)}
              className="flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" /> Back to Step 2
            </Button>
            <Button
              type="submit"
              className="flex items-center gap-2 bg-brand-gradient hover:opacity-90 text-white font-bold shadow-brand border-0 cursor-pointer"
            >
              <Save className="w-5 h-5" /> Save Changes
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

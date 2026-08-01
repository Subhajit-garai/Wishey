"use client";

import { useState, useEffect } from "react";
import { X, Calendar, Star, Heart, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { FolderItem } from "./FolderModal";

export interface DateItem {
  id: string;
  name: string;
  date: string;
  folderId?: string | null;
  folderName?: string | null;
  relation: string;
  specialRating: number;
  eventType: string;
  notes?: string | null;
  daysLeft?: number;
  isToday?: boolean;
  isTomorrow?: boolean;
  badgeText?: string;
  formattedNextOccurrence?: string;
  formattedOriginalDate?: string;
  turningAge?: number;
}

interface DateModalProps {
  isOpen: boolean;
  onClose: () => void;
  dateToEdit?: DateItem | null;
  folders: FolderItem[];
  onSuccess: () => void;
}

const RELATIONS = [
  "Mother",
  "Father",
  "Spouse / Partner",
  "Sibling",
  "Best Friend",
  "Friend",
  "Child",
  "Colleague",
  "Mentor",
  "Relative",
  "Other",
];

const EVENT_TYPES = [
  { value: "birthday", label: "Birthday 🎂" },
  { value: "anniversary", label: "Anniversary 💍" },
  { value: "milestone", label: "Milestone ⭐" },
  { value: "other", label: "Special Occasion 🎉" },
];

export function DateModal({
  isOpen,
  onClose,
  dateToEdit,
  folders,
  onSuccess,
}: DateModalProps) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [folderId, setFolderId] = useState("none");
  const [relation, setRelation] = useState("Friend");
  const [specialRating, setSpecialRating] = useState<number>(8);
  const [eventType, setEventType] = useState("birthday");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (dateToEdit) {
      setName(dateToEdit.name || "");
      setDate(dateToEdit.date || "");
      setFolderId(dateToEdit.folderId || "none");
      setRelation(dateToEdit.relation || "Friend");
      setSpecialRating(dateToEdit.specialRating || 8);
      setEventType(dateToEdit.eventType || "birthday");
      setNotes(dateToEdit.notes || "");
    } else {
      setName("");
      setDate(new Date().toISOString().split("T")[0]);
      setFolderId("none");
      setRelation("Friend");
      setSpecialRating(8);
      setEventType("birthday");
      setNotes("");
    }
  }, [dateToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Person's name is required");
      return;
    }
    if (!date) {
      toast.error("Please select a date");
      return;
    }

    setIsSubmitting(true);
    try {
      const isEditing = !!dateToEdit;
      const url = "/api/dates";
      const method = isEditing ? "PUT" : "POST";
      const payload = {
        ...(isEditing ? { id: dateToEdit.id } : {}),
        name: name.trim(),
        date,
        folderId: folderId === "none" ? null : folderId,
        relation: relation.trim(),
        specialRating: Number(specialRating),
        eventType,
        notes: notes.trim(),
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(
          isEditing
            ? "Close one's date updated successfully!"
            : "Close one's date saved successfully!"
        );
        onSuccess();
        onClose();
      } else {
        toast.error(data.error || "Failed to save date");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-background border border-border/60 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/40">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {dateToEdit ? "Edit Close One's Date" : "Add Close One's Date"}
              </h3>
              <p className="text-xs text-muted-foreground">
                Never forget special birthdays, anniversaries, & milestones
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Person's Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Person / Occasion Name *
            </label>
            <Input
              type="text"
              placeholder="e.g. Mom, Alex Johnson, Sister Sarah"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full font-medium"
              maxLength={100}
            />
          </div>

          {/* Date & Event Type Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Date *
              </label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Event Type
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {EVENT_TYPES.map((et) => (
                  <option key={et.value} value={et.value}>
                    {et.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Relation & Folder Selection Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Relation *
              </label>
              <select
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {RELATIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Folder (Category)
              </label>
              <select
                value={folderId}
                onChange={(e) => setFolderId(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="none">📂 No Folder (General)</option>
                {folders.map((f) => (
                  <option key={f.id} value={f.id}>
                    📁 {f.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Special Rating Slider (1 - 10) */}
          <div className="p-4 rounded-xl bg-accent/40 border border-border/50">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                Special Rating (1 - 10)
              </label>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-extrabold">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{specialRating} / 10</span>
              </div>
            </div>

            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={specialRating}
              onChange={(e) => setSpecialRating(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-2 bg-border rounded-lg"
            />

            <div className="flex justify-between text-[10px] font-semibold text-muted-foreground mt-1 px-1">
              <span>1 (Casual)</span>
              <span>5 (Important)</span>
              <span>10 (VIP / Closest)</span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Gift Ideas or Notes (Optional)
            </label>
            <Textarea
              placeholder="e.g. Loves watches, favorite cake flavor is Chocolate, likes flowers..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full resize-none"
              maxLength={400}
            />
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/40">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-pink-600 via-rose-600 to-indigo-600 hover:from-pink-700 hover:to-indigo-700 text-white font-semibold shadow-md"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : dateToEdit ? (
                "Update Date"
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  Save Date
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

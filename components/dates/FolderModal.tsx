"use client";

import { useState, useEffect } from "react";
import { X, FolderPlus, FolderEdit, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export interface FolderItem {
  id: string;
  name: string;
  description?: string | null;
  dateCount?: number;
}

interface FolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  folderToEdit?: FolderItem | null;
  onSuccess: () => void;
}

export function FolderModal({
  isOpen,
  onClose,
  folderToEdit,
  onSuccess,
}: FolderModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (folderToEdit) {
      setName(folderToEdit.name || "");
      setDescription(folderToEdit.description || "");
    } else {
      setName("");
      setDescription("");
    }
  }, [folderToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Folder name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const isEditing = !!folderToEdit;
      const url = "/api/folders";
      const method = isEditing ? "PUT" : "POST";
      const payload = isEditing
        ? { id: folderToEdit.id, name: name.trim(), description: description.trim() }
        : { name: name.trim(), description: description.trim() };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(
          isEditing ? "Folder updated successfully!" : "Folder created successfully!"
        );
        onSuccess();
        onClose();
      } else {
        toast.error(data.error || "Failed to save folder");
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
        className="relative w-full max-w-md bg-background border border-border/60 rounded-2xl shadow-2xl p-6 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
              {folderToEdit ? <FolderEdit className="w-5 h-5" /> : <FolderPlus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {folderToEdit ? "Edit Folder" : "Create New Folder"}
              </h3>
              <p className="text-xs text-muted-foreground">
                Group your close ones' dates into categories
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
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Folder Name *
            </label>
            <Input
              type="text"
              placeholder="e.g. Family, Best Friends, College Mates"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full"
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Description (Optional)
            </label>
            <Textarea
              placeholder="Brief note about what dates belong in this folder..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full resize-none"
              maxLength={300}
            />
          </div>

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
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold shadow-md"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : folderToEdit ? (
                "Update Folder"
              ) : (
                "Create Folder"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

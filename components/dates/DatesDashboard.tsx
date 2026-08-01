"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar as CalendarIcon,
  Folder,
  FolderPlus,
  Plus,
  Search,
  Star,
  Gift,
  Edit2,
  Trash2,
  Clock,
  Sparkles,
  Heart,
  UserCheck,
  ArrowUpDown,
  FileSpreadsheet,
  Download,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { DateModal, type DateItem } from "./DateModal";
import { FolderModal, type FolderItem } from "./FolderModal";
import { ImportExcelModal } from "./ImportExcelModal";
import { getRelationColor } from "@/lib/date-utils";

interface DatesDashboardProps {
  currentUserName: string;
  currentUserEmail: string;
}

export function DatesDashboard({
  currentUserName,
  currentUserEmail,
}: DatesDashboardProps) {
  const router = useRouter();

  const [datesList, setDatesList] = useState<DateItem[]>([]);
  const [foldersList, setFoldersList] = useState<FolderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & State
  const [selectedFolderId, setSelectedFolderId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"upcoming" | "rating" | "name">("upcoming");

  // Modals
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [dateToEdit, setDateToEdit] = useState<DateItem | null>(null);

  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [folderToEdit, setFolderToEdit] = useState<FolderItem | null>(null);

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Fetch Folders and Dates from API
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [foldersRes, datesRes] = await Promise.all([
        fetch("/api/folders"),
        fetch("/api/dates"),
      ]);

      const foldersData = await foldersRes.json();
      const datesData = await datesRes.json();

      if (foldersData.success) {
        setFoldersList(foldersData.data || []);
      }
      if (datesData.success) {
        setDatesList(datesData.data || []);
      }
    } catch (error) {
      console.error("Error loading dates data:", error);
      toast.error("Failed to load your close ones' dates.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Export dates of a specific folder or all folders into Excel file (.xlsx)
  const handleExportFolder = (targetFolderId: string, customFolderName?: string) => {
    let datesToExport = [...datesList];
    let exportTitle = "all_close_ones";

    if (targetFolderId !== "all") {
      if (targetFolderId === "none") {
        datesToExport = datesToExport.filter((d) => !d.folderId);
        exportTitle = "uncategorized";
      } else {
        datesToExport = datesToExport.filter((d) => d.folderId === targetFolderId);
        const folderObj = foldersList.find((f) => f.id === targetFolderId);
        exportTitle = (customFolderName || folderObj?.name || "folder")
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "_");
      }
    }

    if (datesToExport.length === 0) {
      toast.error("No dates found to export in this folder.");
      return;
    }

    const exportRows = datesToExport.map((item) => ({
      Name: item.name,
      Date: item.date,
      Relation: item.relation,
      Gender: item.gender || "other",
      "Special Rating": item.specialRating,
      Folder:
        item.folderName ||
        (item.folderId
          ? foldersList.find((f) => f.id === item.folderId)?.name || ""
          : "Uncategorized"),
      "Event Type": item.eventType,
      "Days Left": item.badgeText || (item.daysLeft !== undefined ? `${item.daysLeft} days` : ""),
      "Next Occurrence": item.formattedNextOccurrence || "",
      Notes: item.notes || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Close Ones Dates");

    const fileName = `wishey_${exportTitle}_dates.xlsx`;
    XLSX.writeFile(workbook, fileName);
    toast.success(`Exported ${datesToExport.length} date(s) to ${fileName}!`);
  };

  // Quick inline Folder reassignment for a Date
  const handleQuickFolderChange = async (dateId: string, newFolderId: string) => {
    try {
      const targetFolder = foldersList.find((f) => f.id === newFolderId);
      const folderName = targetFolder ? targetFolder.name : "Uncategorized";

      // Optimistic update
      setDatesList((prev) =>
        prev.map((d) =>
          d.id === dateId
            ? {
                ...d,
                folderId: newFolderId === "none" ? null : newFolderId,
                folderName: newFolderId === "none" ? null : folderName,
              }
            : d
        )
      );

      const res = await fetch("/api/dates", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: dateId,
          folderId: newFolderId === "none" ? null : newFolderId,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Moved date to folder "${folderName}"!`);
        fetchData();
      } else {
        toast.error(data.error || "Failed to change folder.");
        fetchData(); // revert
      }
    } catch (err) {
      toast.error("Error updating folder.");
      fetchData();
    }
  };

  // Handle Delete Date
  const handleDeleteDate = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}'s date entry?`)) return;

    try {
      const res = await fetch(`/api/dates?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success(`Deleted ${name}'s date entry.`);
        fetchData();
      } else {
        toast.error(data.error || "Failed to delete date.");
      }
    } catch (err) {
      toast.error("Error deleting date entry.");
    }
  };

  // Handle Delete Folder
  const handleDeleteFolder = async (id: string, name: string) => {
    if (
      !confirm(
        `Are you sure you want to delete folder "${name}"? (Dates inside will be moved to No Folder)`
      )
    )
      return;

    try {
      const res = await fetch(`/api/folders?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success(`Deleted folder "${name}".`);
        if (selectedFolderId === id) setSelectedFolderId("all");
        fetchData();
      } else {
        toast.error(data.error || "Failed to delete folder.");
      }
    } catch (err) {
      toast.error("Error deleting folder.");
    }
  };

  // Quick action to navigate to Wishey Wish Card Creator
  const handleCreateWishCard = (item: DateItem) => {
    const occasion = item.eventType === "anniversary" ? "anniversary" : "birthday";
    const query = new URLSearchParams({
      recipientName: item.name,
      occasion: occasion,
      relation: item.relation,
    }).toString();

    router.push(`/wish/create?${query}`);
  };

  // Filtered & Sorted Dates
  const processedDates = useMemo(() => {
    let result = [...datesList];

    // Filter by Folder
    if (selectedFolderId !== "all") {
      if (selectedFolderId === "none") {
        result = result.filter((d) => !d.folderId);
      } else {
        result = result.filter((d) => d.folderId === selectedFolderId);
      }
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.relation.toLowerCase().includes(q) ||
          (d.gender && d.gender.toLowerCase().includes(q)) ||
          (d.folderName && d.folderName.toLowerCase().includes(q)) ||
          (d.notes && d.notes.toLowerCase().includes(q))
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "upcoming") {
        return (a.daysLeft ?? 999) - (b.daysLeft ?? 999);
      }
      if (sortBy === "rating") {
        return b.specialRating - a.specialRating;
      }
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    return result;
  }, [datesList, selectedFolderId, searchQuery, sortBy]);

  // Statistics
  const stats = useMemo(() => {
    const total = datesList.length;
    const todayEvents = datesList.filter((d) => d.isToday).length;
    const thisMonth = datesList.filter((d) => (d.daysLeft ?? 999) <= 30).length;
    const topVip = datesList.filter((d) => d.specialRating >= 9).length;

    return { total, todayEvents, thisMonth, topVip };
  }, [datesList]);

  // Current folder title for Header
  const activeFolderName = useMemo(() => {
    if (selectedFolderId === "all") return "All Dates";
    if (selectedFolderId === "none") return "Uncategorized";
    const found = foldersList.find((f) => f.id === selectedFolderId);
    return found ? found.name : "Folder";
  }, [selectedFolderId, foldersList]);

  // Share Wishey App / Dates via Web Share API or Clipboard link
  const handleShareApp = async () => {
    const shareData = {
      title: "Wishey - Close Ones & Important Dates",
      text: "Track birthdays, anniversaries, & milestones for your close ones with live countdowns on Wishey! 🎁",
      url: typeof window !== "undefined" ? window.location.origin + "/dates" : "https://wishey.com/dates",
    };

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("Shared successfully!");
      } catch {
        // User closed share dialog
      }
    } else {
      navigator.clipboard.writeText(shareData.url);
      toast.success("Wishey link copied to clipboard! Paste and share on WhatsApp, Instagram, or Telegram.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-accent/20 py-8 px-4 md:px-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/90 via-purple-900/90 to-pink-900/90 p-6 md:p-10 text-white shadow-2xl border border-white/10">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-pink-300 border border-white/20">
                <Sparkles className="w-3.5 h-3.5" />
                Close Ones & Important Dates Tracker
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-pink-100 to-purple-200 bg-clip-text text-transparent">
                Never Miss a Special Day
              </h1>
              <p className="text-sm md:text-base text-purple-200/90">
                Save birthdays, anniversaries, and milestones for your close ones.
                Track countdowns, group into folders, and create instant wish cards!
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleShareApp}
                variant="outline"
                className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border-purple-400/40 font-semibold backdrop-blur-sm cursor-pointer"
              >
                <Share2 className="w-4 h-4 mr-2 text-purple-300" />
                Share App
              </Button>
              <Button
                onClick={() => setIsImportModalOpen(true)}
                variant="outline"
                className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border-emerald-400/40 font-semibold backdrop-blur-sm cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2 text-emerald-400" />
                Import Excel / CSV
              </Button>
              <Button
                onClick={() => {
                  setFolderToEdit(null);
                  setIsFolderModalOpen(true);
                }}
                variant="outline"
                className="bg-white/10 hover:bg-white/20 text-white border-white/30 font-semibold backdrop-blur-sm cursor-pointer"
              >
                <FolderPlus className="w-4 h-4 mr-2" />
                New Folder
              </Button>
              <Button
                onClick={() => {
                  setDateToEdit(null);
                  setIsDateModalOpen(true);
                }}
                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold shadow-lg shadow-pink-500/25 cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Close One's Date
              </Button>
            </div>
          </div>

          {/* Background Decorative Glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-pink-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-card border border-border/50 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Total Dates Saved</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border/50 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Events Today 🎉</p>
              <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">{stats.todayEvents}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border/50 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Next 30 Days</p>
              <p className="text-2xl font-bold">{stats.thisMonth}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border/50 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Star className="w-6 h-6 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground">VIP Close Ones (9-10★)</p>
              <p className="text-2xl font-bold">{stats.topVip}</p>
            </div>
          </div>
        </div>

        {/* Main Content Area: Folders Sidebar + Dates Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Folders Navigation Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="p-5 rounded-2xl bg-card border border-border/50 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Folder className="w-4 h-4 text-purple-500" />
                  Folders ({foldersList.length})
                </h2>
                <button
                  onClick={() => {
                    setFolderToEdit(null);
                    setIsFolderModalOpen(true);
                  }}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
                  title="Create Folder"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1.5">
                {/* All Dates Folder option */}
                <div className="group relative flex items-center">
                  <button
                    onClick={() => setSelectedFolderId("all")}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                      selectedFolderId === "all"
                        ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                        : "hover:bg-accent text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Folder className="w-4 h-4" />
                      <span>All Dates</span>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        selectedFolderId === "all"
                          ? "bg-white/20 text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {datesList.length}
                    </span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExportFolder("all");
                    }}
                    className="absolute right-9 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded text-muted-foreground hover:text-emerald-500 bg-background/80 hover:bg-emerald-500/10 shadow-sm cursor-pointer"
                    title="Export All Dates to Excel"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* No Folder option */}
                <div className="group relative flex items-center">
                  <button
                    onClick={() => setSelectedFolderId("none")}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                      selectedFolderId === "none"
                        ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                        : "hover:bg-accent text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Folder className="w-4 h-4 opacity-60" />
                      <span>Uncategorized</span>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        selectedFolderId === "none"
                          ? "bg-white/20 text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {datesList.filter((d) => !d.folderId).length}
                    </span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExportFolder("none");
                    }}
                    className="absolute right-9 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded text-muted-foreground hover:text-emerald-500 bg-background/80 hover:bg-emerald-500/10 shadow-sm cursor-pointer"
                    title="Export Uncategorized Dates to Excel"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* User Created Folders */}
                {foldersList.map((f) => (
                  <div key={f.id} className="group relative flex items-center">
                    <button
                      onClick={() => setSelectedFolderId(f.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                        selectedFolderId === f.id
                          ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                          : "hover:bg-accent text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate pr-16">
                        <Folder className="w-4 h-4 text-purple-400" />
                        <span className="truncate">{f.name}</span>
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                          selectedFolderId === f.id
                            ? "bg-white/20 text-white"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {f.dateCount ?? 0}
                      </span>
                    </button>

                    {/* Folder Export / Edit / Delete Buttons */}
                    <div className="absolute right-9 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExportFolder(f.id, f.name);
                        }}
                        className="p-1 rounded text-muted-foreground hover:text-emerald-500 bg-background/80 hover:bg-emerald-500/10 shadow-sm cursor-pointer"
                        title={`Export "${f.name}" dates to Excel`}
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setFolderToEdit(f);
                          setIsFolderModalOpen(true);
                        }}
                        className="p-1 rounded text-muted-foreground hover:text-foreground bg-background/80 hover:bg-accent shadow-sm cursor-pointer"
                        title="Edit Folder"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFolder(f.id, f.name);
                        }}
                        className="p-1 rounded text-rose-500 hover:text-rose-600 bg-background/80 hover:bg-rose-500/10 shadow-sm cursor-pointer"
                        title="Delete Folder"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Dates List Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search, Filter & Sort Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border/50 shadow-sm">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name, relation, gender, folder, notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full bg-background"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  onClick={() => handleExportFolder(selectedFolderId, activeFolderName)}
                  variant="outline"
                  size="sm"
                  className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-semibold hover:bg-emerald-500/10 cursor-pointer text-xs"
                  title={`Export ${activeFolderName} to Excel`}
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  Export Folder (.xlsx)
                </Button>

                <div className="flex items-center gap-2 bg-background border border-input px-3 py-1.5 rounded-md text-xs font-semibold">
                  <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
                  <select
                    value={sortBy}
                    onChange={(e: any) => setSortBy(e.target.value)}
                    className="bg-transparent text-xs font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="upcoming">Sort: Upcoming First</option>
                    <option value="rating">Sort: Highest Rating (10-1)</option>
                    <option value="name">Sort: Name (A-Z)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Loading Skeleton */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-44 rounded-2xl bg-card border border-border/40 p-6 animate-pulse space-y-4"
                  >
                    <div className="flex justify-between">
                      <div className="h-6 w-32 bg-accent/60 rounded" />
                      <div className="h-6 w-20 bg-accent/60 rounded-full" />
                    </div>
                    <div className="h-4 w-24 bg-accent/40 rounded" />
                    <div className="h-8 w-full bg-accent/30 rounded-xl" />
                  </div>
                ))}
              </div>
            ) : processedDates.length === 0 ? (
              /* Empty State */
              <div className="p-12 text-center rounded-3xl bg-card border border-border/50 shadow-sm space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-500 mx-auto">
                  <CalendarIcon className="w-8 h-8" />
                </div>
                <div className="space-y-1 max-w-md mx-auto">
                  <h3 className="text-xl font-bold">No Close Ones' Dates Found</h3>
                  <p className="text-sm text-muted-foreground">
                    {searchQuery
                      ? "No dates matched your search query. Try resetting your search."
                      : "Start saving your friends' and family's birthdays, anniversaries, and milestones."}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <Button
                    onClick={() => setIsImportModalOpen(true)}
                    variant="outline"
                    className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-semibold"
                  >
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Import Excel
                  </Button>
                  <Button
                    onClick={() => {
                      setDateToEdit(null);
                      setIsDateModalOpen(true);
                    }}
                    className="bg-gradient-to-r from-pink-600 to-indigo-600 text-white font-semibold cursor-pointer"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Date
                  </Button>
                </div>
              </div>
            ) : (
              /* Dates Cards Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {processedDates.map((item) => {
                  const relationBadgeStyle = getRelationColor(item.relation);
                  const currentFolderName =
                    foldersList.find((f) => f.id === item.folderId)?.name || item.folderName;

                  const genderIcon =
                    item.gender === "female"
                      ? "👩"
                      : item.gender === "male"
                      ? "👨"
                      : "🌈";

                  return (
                    <div
                      key={item.id}
                      className="group relative rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-xl hover:border-purple-500/30 transition-all duration-300 p-5 flex flex-col justify-between overflow-hidden"
                    >
                      {/* Top Bar: Person Name, Gender, Event Badge, Days Left */}
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-lg font-bold group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                {item.name}
                              </h3>
                              <span className="text-xs" title={`Gender: ${item.gender || "other"}`}>
                                {genderIcon}
                              </span>
                              <span
                                className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${relationBadgeStyle}`}
                              >
                                {item.relation}
                              </span>
                            </div>

                            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5 font-medium">
                              <span>
                                {item.eventType === "birthday"
                                  ? "🎂 Birthday"
                                  : item.eventType === "anniversary"
                                  ? "💍 Anniversary"
                                  : item.eventType === "milestone"
                                  ? "⭐ Milestone"
                                  : "🎉 Special Day"}
                              </span>
                              <span>•</span>
                              <span>{item.formattedOriginalDate}</span>
                              {item.turningAge !== undefined && (
                                <>
                                  <span>•</span>
                                  <span className="text-foreground font-semibold">
                                    Turning {item.turningAge}
                                  </span>
                                </>
                              )}
                            </p>
                          </div>

                          {/* Days Left Countdown Badge */}
                          <div
                            className={`px-3 py-1 rounded-full text-xs font-black tracking-tight border flex items-center gap-1 shadow-sm shrink-0 ${
                              item.isToday
                                ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white border-pink-400 animate-pulse shadow-pink-500/30"
                                : item.isTomorrow
                                ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/40"
                                : (item.daysLeft ?? 999) < 14
                                ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30"
                                : "bg-accent/60 text-muted-foreground border-border/50"
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>{item.badgeText}</span>
                          </div>
                        </div>

                        {/* Special Rating (1-10) Indicator Bar */}
                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-accent/30 border border-border/40 text-xs">
                          <span className="text-muted-foreground font-medium flex items-center gap-1">
                            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                            Special Rating:
                          </span>
                          <div className="flex items-center gap-1.5 font-extrabold text-amber-600 dark:text-amber-400">
                            <div className="flex items-center">
                              {[...Array(Math.min(5, Math.ceil(item.specialRating / 2)))].map(
                                (_, idx) => (
                                  <Star
                                    key={idx}
                                    className="w-3.5 h-3.5 fill-amber-500 text-amber-500"
                                  />
                                )
                              )}
                            </div>
                            <span>{item.specialRating} / 10</span>
                          </div>
                        </div>

                        {/* Visible Folder Badge & Inline Folder Switcher Dropdown */}
                        <div className="flex items-center justify-between p-2 rounded-xl bg-purple-500/5 border border-purple-500/15 text-xs">
                          <div className="flex items-center gap-1.5 font-semibold text-purple-700 dark:text-purple-300">
                            <Folder className="w-3.5 h-3.5 text-purple-500" />
                            <span>Folder:</span>
                            <span className="font-bold text-foreground">
                              {currentFolderName ? `📁 ${currentFolderName}` : "📂 Uncategorized"}
                            </span>
                          </div>

                          {/* Quick Change Folder Dropdown */}
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-muted-foreground">Move to:</span>
                            <select
                              value={item.folderId || "none"}
                              onChange={(e) => handleQuickFolderChange(item.id, e.target.value)}
                              className="h-7 px-2 rounded-md border border-purple-500/20 bg-background text-[11px] font-bold focus:outline-none cursor-pointer"
                            >
                              <option value="none">📂 No Folder</option>
                              {foldersList.map((f) => (
                                <option key={f.id} value={f.id}>
                                  📁 {f.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Notes if available */}
                        {item.notes && (
                          <p className="text-xs text-muted-foreground italic bg-accent/20 p-2 rounded-lg border border-border/30">
                            &quot;{item.notes}&quot;
                          </p>
                        )}
                      </div>

                      {/* Card Action Footer */}
                      <div className="mt-5 pt-3 border-t border-border/40 flex items-center justify-between gap-2">
                        <Button
                          onClick={() => handleCreateWishCard(item)}
                          size="sm"
                          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-xs rounded-xl shadow-md cursor-pointer flex-1"
                        >
                          <Gift className="w-3.5 h-3.5 mr-1.5" />
                          Create Wish Card
                        </Button>

                        <div className="flex items-center gap-1">
                          <Button
                            onClick={() => {
                              setDateToEdit(item);
                              setIsDateModalOpen(true);
                            }}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                            title="Edit Date"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteDate(item.id, item.name)}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                            title="Delete Date"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <DateModal
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
        dateToEdit={dateToEdit}
        folders={foldersList}
        onSuccess={fetchData}
      />

      <FolderModal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        folderToEdit={folderToEdit}
        onSuccess={fetchData}
      />

      <ImportExcelModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        folders={foldersList}
        onSuccess={fetchData}
      />
    </div>
  );
}

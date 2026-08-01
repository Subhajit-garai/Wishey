"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/designs/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Users,
  Gift,
  Eye,
  Heart,
  Trash2,
  ExternalLink,
  ShieldCheck,
  ArrowLeft,
  ArrowRightLeft,
  RefreshCw,
  Search,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { type Wish } from "@/app/wish/types";

interface AdminStats {
  stats: {
    totalUsers: number;
    totalWishes: number;
    totalViews: number;
    totalReactions: number;
    totalShares: number;
  };
  wishes: Wish[];
  users: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  }[];
}

export default function AdminDashboard() {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [data, setData] = useState<AdminStats | null>(null);
  const [activeTab, setActiveTab] = useState<"wishes" | "users">("wishes");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Authenticate and fetch stats from server
  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      const result = await response.json();
      if (response.ok && result.success) {
        setAuthorized(true);
        setData(result.data);
      } else {
        setAuthorized(false);
        toast.error(result.message || "Access denied. Admin privileges required.");
      }
    } catch (err) {
      console.error(err);
      setAuthorized(false);
      toast.error("Network error fetching statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Delete wish handler
  const handleDeleteWish = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this wish card permanently?")) {
      return;
    }

    const toastId = toast.loading("Deleting wish card from database...");

    try {
      const response = await fetch(`/api/admin/wish/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (result.success) {
        toast.success("Successfully deleted wish card.", { id: toastId });
        // Refresh local data state
        if (data) {
          setData({
            ...data,
            stats: {
              ...data.stats,
              totalWishes: data.stats.totalWishes - 1,
            },
            wishes: data.wishes.filter((w) => w.id !== id),
          });
        }
      } else {
        toast.error(result.message || "Failed to delete wish card.", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error during deletion.", { id: toastId });
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center gap-4">
        <RefreshCw className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground text-sm font-semibold">Authenticating admin panel...</p>
      </div>
    );
  }

  // Access denied screen
  if (!authorized) {
    return (
      <div className="w-full min-h-[calc(100vh-5rem)] p-6 flex flex-col items-center justify-center text-center gap-6 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive shadow-lg shadow-destructive/5">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black tracking-tight">Access Denied</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            You do not have administrative privileges to monitor this application. Please log in with an administrator account to continue.
          </p>
        </div>
        <div className="flex flex-col gap-2 w-full mt-4">
          <Button onClick={() => router.push("/login")} className="w-full">
            Log in as Admin
          </Button>
          <Button onClick={() => router.push("/")} variant="outline" className="w-full">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const filteredWishes = data?.wishes.filter(
    (w) =>
      w.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.recipient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.occasion.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const filteredUsers = data?.users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] p-4 md:p-10 max-w-7xl mx-auto flex flex-col gap-8">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground text-sm font-semibold">
            <Link href="/" className="hover:text-foreground flex items-center gap-1 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to App
            </Link>
          </div>
          <h1 className="text-3xl font-black tracking-tight mt-1 flex items-center gap-2.5">
            Admin <span className="text-brand-gradient">Control Center</span>
            <span className="bg-primary/10 border border-primary/20 text-primary text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Monitor Mode
            </span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Monitor registered users, inspect wish card performance metrics, and review user content.
          </p>
        </div>

        <Button
          onClick={fetchStats}
          variant="outline"
          size="sm"
          className="w-full md:w-auto flex items-center justify-center gap-1.5 cursor-pointer font-bold"
        >
          <RefreshCw className="w-4 h-4" /> Refresh Data
        </Button>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <Card variant="glass" className="p-6 flex items-center gap-5 hoverEffect">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider block">Total Users</span>
            <span className="text-3xl font-black text-slate-800 dark:text-slate-100">{data?.stats.totalUsers || 0}</span>
          </div>
        </Card>

        {/* Total Wishes */}
        <Card variant="glass" className="p-6 flex items-center gap-5 hoverEffect">
          <div className="w-12 h-12 rounded-xl bg-pink-500/10 text-pink-500 border border-pink-500/20 flex items-center justify-center shrink-0">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider block">Total Wishes</span>
            <span className="text-3xl font-black text-slate-800 dark:text-slate-100">{data?.stats.totalWishes || 0}</span>
          </div>
        </Card>

        {/* Total Views */}
        <Card variant="glass" className="p-6 flex items-center gap-5 hoverEffect">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider block">Total Views</span>
            <span className="text-3xl font-black text-slate-800 dark:text-slate-100">{data?.stats.totalViews || 0}</span>
          </div>
        </Card>

        {/* Total Reactions */}
        <Card variant="glass" className="p-6 flex items-center gap-5 hoverEffect">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center shrink-0">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider block">Total Reactions</span>
            <span className="text-3xl font-black text-slate-800 dark:text-slate-100">{data?.stats.totalReactions || 0}</span>
          </div>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-full overflow-hidden bg-white/40 dark:bg-black/20 backdrop-blur-md border border-border p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl flex flex-col gap-6">
        {/* Navigation & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div className="flex bg-muted p-1 rounded-xl gap-1 text-sm font-bold">
            <button
              onClick={() => {
                setActiveTab("wishes");
                setSearchTerm("");
              }}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                activeTab === "wishes"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Wishes ({data?.wishes.length || 0})
            </button>
            <button
              onClick={() => {
                setActiveTab("users");
                setSearchTerm("");
              }}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                activeTab === "users"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Users ({data?.users.length || 0})
            </button>
          </div>

          {/* Search bar */}
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search ${activeTab}...`}
              className="pl-9 w-full bg-background/50 border-border/80 focus:border-primary"
            />
          </div>
        </div>

        {/* Tab 1: Wishes Management table */}
        {activeTab === "wishes" && (
          <div className="overflow-x-auto w-full">
            {filteredWishes.length === 0 ? (
              <p className="text-center py-10 text-muted-foreground text-sm">No wish cards found matching the filters.</p>
            ) : (
              <table className="w-full text-sm text-left text-neutral-500 dark:text-neutral-400">
                <thead className="text-xs text-neutral-700 uppercase bg-muted/65 dark:text-neutral-300 border-b border-border/80">
                  <tr>
                    <th className="px-6 py-3">Occasion</th>
                    <th className="px-6 py-3">Card Title</th>
                    <th className="px-6 py-3">Recipient</th>
                    <th className="px-6 py-3">Sender</th>
                    <th className="px-6 py-3 text-center">Views</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWishes.map((wish) => (
                    <tr
                      key={wish.id}
                      className="border-b border-border/40 hover:bg-muted/10 dark:hover:bg-neutral-800/10 text-slate-700 dark:text-neutral-300"
                    >
                      <td className="px-6 py-4">
                        <span className="bg-primary/10 border border-primary/20 text-primary text-xs px-2.5 py-0.5 rounded-full capitalize font-semibold">
                          {wish.occasion}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold">{wish.title}</td>
                      <td className="px-6 py-4">{wish.recipient.name}</td>
                      <td className="px-6 py-4">{wish.sender.anonymous ? "Anonymous" : wish.sender.name}</td>
                      <td className="px-6 py-4 text-center font-mono">{wish.views}</td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        <Link href={`/wish/${wish.id}`} target="_blank">
                          <Button size="sm" variant="outline" className="flex items-center gap-1 text-xs">
                            <ExternalLink className="w-3.5 h-3.5" /> View
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteWish(wish.id)}
                          className="text-destructive hover:bg-destructive/10 flex items-center gap-1 text-xs cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Tab 2: User Registry table */}
        {activeTab === "users" && (
          <div className="overflow-x-auto w-full">
            {filteredUsers.length === 0 ? (
              <p className="text-center py-10 text-muted-foreground text-sm">No registered users found.</p>
            ) : (
              <table className="w-full text-sm text-left text-neutral-500 dark:text-neutral-400">
                <thead className="text-xs text-neutral-700 uppercase bg-muted/65 dark:text-neutral-300 border-b border-border/80">
                  <tr>
                    <th className="px-6 py-3">User ID</th>
                    <th className="px-6 py-3">Full Name</th>
                    <th className="px-6 py-3">Email Address</th>
                    <th className="px-6 py-3">Account Role</th>
                    <th className="px-6 py-3 text-right">Created Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-border/40 hover:bg-muted/10 dark:hover:bg-neutral-800/10 text-slate-700 dark:text-neutral-300"
                    >
                      <td className="px-6 py-4 font-mono text-xs text-neutral-400">{user.id}</td>
                      <td className="px-6 py-4 font-bold">{user.name}</td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                            user.role === "admin"
                              ? "bg-red-100 text-red-700 border border-red-200"
                              : "bg-blue-100 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-xs text-neutral-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

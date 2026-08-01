"use client";

import { ThemeToggler } from "@/designs/theme/index";
import { Button } from "@/components/ui/button";
import NavLink from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

import { EarnTokenModal } from "@/components/EarnTokenModal";
import {
  Coins,
  Menu,
  X,
  Home,
  Gift,
  Plus,
  ShieldAlert,
  LogOut,
  User as UserIcon,
} from "lucide-react";

export const Header = ({
  LogoUrl,
  BrandName,
}: {
  LogoUrl: string;
  BrandName?: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    role: string;
    tokens?: number;
  } | null>(null);

  // Close mobile menu whenever navigation path changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const fetchTokens = async () => {
    try {
      const res = await fetch("/api/user/token");
      const data = await res.json();
      if (data.success && data.data?.tokens !== undefined) {
        setCurrentUser((prev) =>
          prev ? { ...prev, tokens: data.data.tokens } : prev,
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    // Check session status from server
    const checkSession = async () => {
      try {
        const res = await fetch("/api/user/me");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
            setCurrentUser(data.data);
            fetchTokens();
            return;
          }
        }
      } catch (e) {
        console.error(e);
      }
      // Fallback check local storage
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("wishey_user");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setCurrentUser(parsed);
            fetchTokens();
          } catch {}
        }
      }
    };

    checkSession();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/user/logout", { method: "POST" });
    } catch (e) {
      console.error("Logout error:", e);
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem("wishey_user");
    }
    setCurrentUser(null);
    setIsMobileMenuOpen(false);
    toast.success("Successfully logged out.");
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="header sticky top-0 right-0 left-0 h-20 max-w-full z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 md:px-10 h-full">
        {/* Brand Logo & Title */}
        <NavLink
          href="/"
          className="h-fit gap-3 flex items-center group cursor-pointer"
        >
          <Image
            className="transition-transform duration-300 group-hover:scale-105 drop-shadow-md"
            src={LogoUrl}
            alt="Wishey Logo"
            width={40}
            height={40}
            priority
          />

          <div className="flex flex-col justify-start">
            <p className="text-lg md:text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent tracking-tight">
              {BrandName}
            </p>
            <p className="text-xs text-muted-foreground font-medium hidden sm:block">
              wish your close ones..
            </p>
          </div>
        </NavLink>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-2">
          <NavLink href={"/"}>
            <Button variant="ghost" className="font-semibold hover:bg-accent">
              Home
            </Button>
          </NavLink>
          <NavLink href={"/wish/list"}>
            <Button variant="ghost" className="font-semibold hover:bg-accent">
              My Wishes
            </Button>
          </NavLink>
          <NavLink href={"/wish/create"}>
            <Button variant="ghost" className="font-semibold hover:bg-accent">
              Create Wish
            </Button>
          </NavLink>
          {currentUser?.role === "admin" && (
            <NavLink href={"/admin"}>
              <Button className="bg-red-500 hover:bg-red-600 text-white border-0 font-semibold size-sm">
                Admin Panel
              </Button>
            </NavLink>
          )}
        </div>

        {/* Desktop Right Bar Actions */}
        <div className="hidden md:flex items-center gap-3">
          {currentUser && (
            <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-full text-xs font-bold text-amber-600 dark:text-amber-400">
              <Coins className="w-4 h-4 text-amber-500" />
              <span>{currentUser.tokens ?? 3} Tokens</span>
            </div>
          )}

          <EarnTokenModal
            userEmail={currentUser?.email}
            onTokenEarned={(newCount) => {
              setCurrentUser((prev) =>
                prev ? { ...prev, tokens: newCount } : prev
              );
            }}
          />

          <ThemeToggler />

          {currentUser ? (
            <div className="flex gap-3 items-center">
              <span className="text-xs text-muted-foreground font-semibold">
                <strong className="text-foreground">{currentUser.name}</strong>
              </span>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="cursor-pointer font-medium"
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <NavLink href={"/signup"}>
                <Button variant="outline" size="sm">
                  Sign up
                </Button>
              </NavLink>
              <NavLink href={"/login"}>
                <Button size="sm">Login</Button>
              </NavLink>
            </div>
          )}
        </div>

        {/* Mobile View Toggle Buttons */}
        <div className="flex md:hidden items-center gap-2">
          {currentUser && (
            <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-2 py-1 rounded-full text-[11px] font-bold text-amber-600 dark:text-amber-400">
              <Coins className="w-3.5 h-3.5 text-amber-500" />
              <span>{currentUser.tokens ?? 3}</span>
            </div>
          )}

          <ThemeToggler />

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="p-2 rounded-lg border border-border/50 text-foreground hover:bg-accent transition-colors cursor-pointer"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer / Dropdown */}
      {isMobileMenuOpen && (
        <div className="fixed inset-x-0 top-20 bg-background/95 backdrop-blur-xl border-b border-border/40 shadow-2xl p-6 flex flex-col gap-5 md:hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50 max-h-[calc(100vh-5rem)] overflow-y-auto">
          {/* User Banner in Mobile Menu */}
          {currentUser ? (
            <div className="flex items-center justify-between pb-4 border-b border-border/40">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <UserIcon className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold">{currentUser.name}</span>
                  <span className="text-xs text-muted-foreground">{currentUser.email}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full text-xs font-bold text-amber-600 dark:text-amber-400">
                <Coins className="w-3.5 h-3.5 text-amber-500" />
                <span>{currentUser.tokens ?? 3} Tokens</span>
              </div>
            </div>
          ) : (
            <div className="pb-4 border-b border-border/40 flex flex-col gap-2">
              <p className="text-xs text-muted-foreground font-semibold">Welcome to Wishey</p>
              <div className="grid grid-cols-2 gap-2">
                <NavLink href={"/login"} className="w-full">
                  <Button className="w-full" size="sm">Login</Button>
                </NavLink>
                <NavLink href={"/signup"} className="w-full">
                  <Button variant="outline" className="w-full" size="sm">Sign up</Button>
                </NavLink>
              </div>
            </div>
          )}

          {/* Mobile Menu Links */}
          <div className="flex flex-col gap-2">
            <NavLink
              href="/"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                pathname === "/" ? "bg-primary/10 text-primary" : "hover:bg-accent"
              }`}
            >
              <Home className="w-4 h-4" /> Home
            </NavLink>

            <NavLink
              href="/wish/list"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                pathname === "/wish/list" ? "bg-primary/10 text-primary" : "hover:bg-accent"
              }`}
            >
              <Gift className="w-4 h-4" /> My Wishes
            </NavLink>

            <NavLink
              href="/wish/create"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                pathname === "/wish/create" ? "bg-primary/10 text-primary" : "hover:bg-accent"
              }`}
            >
              <Plus className="w-4 h-4" /> Create a Wish Card
            </NavLink>

            {currentUser?.role === "admin" && (
              <NavLink
                href="/admin"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors text-red-600 dark:text-red-400 ${
                  pathname === "/admin" ? "bg-red-500/10" : "hover:bg-red-500/10"
                }`}
              >
                <ShieldAlert className="w-4 h-4" /> Admin Panel
              </NavLink>
            )}
          </div>

          {/* Action Footer in Mobile Menu */}
          <div className="pt-4 border-t border-border/40 flex flex-col gap-3">
            <EarnTokenModal
              userEmail={currentUser?.email}
              onTokenEarned={(newCount) => {
                setCurrentUser((prev) =>
                  prev ? { ...prev, tokens: newCount } : prev
                );
              }}
            />

            {currentUser && (
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full flex items-center justify-center gap-2 text-rose-600 dark:text-rose-400 border-rose-500/30 hover:bg-rose-500/10 cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Logout Account
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;

"use client";

import { Card } from "@/designs/card/Card";
import { type Wish } from "../types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { WishTemplateRenderer } from "@/designs/wishtemplates";
import {
  Sparkles,
  Heart,
  Gift,
  Calendar,
  User,
  Plus,
  Trash,
  ChevronRight,
  ChevronLeft,
  Stars,
  Maximize2,
  FolderHeart,
  Smile,
  ArrowLeft,
  Eye,
  X,
} from "lucide-react";
import Link from "next/link";

interface WishTemplate {
  name: string;
  tagline: string;
  icon: string;
  previewColors: string[];
  wishData: Partial<Wish>;
}

// 25 Predefined templates (5 for each of the 5 categories) with templateId mapped
const TEMPLATES_RECORD: Record<
  "birthday" | "anniversary" | "wedding" | "valentine" | "other",
  WishTemplate[]
> = {
  birthday: [
    {
      name: "Golden Celebration",
      tagline: "Elegant dark design with gold sparkling highlights",
      icon: "✨",
      previewColors: ["#D4AF37", "#121212"],
      wishData: {
        templateId: "birthday-1",
        occasion: "birthday",
        title: "Happy Birthday, Superstar!",
        subtitle: "Wishing you a year as bright as your smile",
        description: "Another year older, another year wiser, and another year of being absolutely fabulous! We hope this year brings you infinite success, happiness, and memorable milestones.",
        quote: "Count your age by friends, not years. Count your life by smiles, not tears.",
        theme: "dark-gold",
        colors: { primary: "#D4AF37", secondary: "#1C1C1C", background: "#121212", text: "#FFFFFF" },
        animation: { confetti: true, balloons: false, fireworks: true, floatingHearts: false, snow: false }
      }
    },
    {
      name: "Pastel Confetti Party",
      tagline: "Soft, colorful theme ideal for sweet celebrations",
      icon: "🎂",
      previewColors: ["#FFC0CB", "#E6E6FA"],
      wishData: {
        templateId: "birthday-2",
        occasion: "birthday",
        title: "Cheers to Another Sweet Year!",
        subtitle: "Hope your day is colorful, fun, and magical",
        description: "Wishing you the happiest of birthdays filled with love, laughter, and a double serving of cake! May all your secret wishes come true today.",
        poem: "A year of dreams, a year of cheer, we wish you joy, both far and near. May paths you choose and steps you take, bring joy with every choice you make.",
        theme: "pastel-pink",
        colors: { primary: "#FFC0CB", secondary: "#E6E6FA", background: "#FFF0F5", text: "#4A2E80" },
        animation: { confetti: true, balloons: true, fireworks: false, floatingHearts: false, snow: false }
      }
    },
    {
      name: "Retro Arcade",
      tagline: "80s cyberpunk vibe for the ultimate gamer",
      icon: "🎮",
      previewColors: ["#FF007F", "#8B008B"],
      wishData: {
        templateId: "birthday-3",
        occasion: "birthday",
        title: "Level Up! Happy Birthday!",
        subtitle: "You have unlocked Level [Age]!",
        description: "Time to celebrate another grand lap around the sun. Wishing you high scores, legendary loot, and endless fun in the game of life!",
        theme: "retro-purple",
        colors: { primary: "#FF007F", secondary: "#00F0FF", background: "#120024", text: "#39FF14" },
        animation: { confetti: false, balloons: false, fireworks: true, floatingHearts: false, snow: false }
      }
    },
    {
      name: "Minimal Slate",
      tagline: "Clean, professional, and elegant layout",
      icon: "👔",
      previewColors: ["#475569", "#F8FAFC"],
      wishData: {
        templateId: "birthday-4",
        occasion: "birthday",
        title: "Warmest Birthday Wishes",
        subtitle: "Reflecting on a year of wonderful achievements",
        description: "Wishing you a quiet, wonderful day of celebration. Thank you for your leadership and dedication. May the upcoming year bring you professional excellence and peace.",
        theme: "minimal-slate",
        colors: { primary: "#475569", secondary: "#64748B", background: "#F8FAFC", text: "#0F172A" },
        animation: { confetti: false, balloons: false, fireworks: false, floatingHearts: false, snow: false }
      }
    },
    {
      name: "Cosmic Stardust",
      tagline: "Interstellar stardust theme for dreamers",
      icon: "🚀",
      previewColors: ["#0052D4", "#4364F7"],
      wishData: {
        templateId: "birthday-5",
        occasion: "birthday",
        title: "To the Moon and Back!",
        subtitle: "Wishing you a stellar birthday celebration",
        description: "May your birthday be completely out of this world! Sending you galactic love and starlight on this very special day.",
        theme: "cosmic-blue",
        colors: { primary: "#0052D4", secondary: "#6FB1FC", background: "#050B1A", text: "#FFFFFF" },
        animation: { confetti: true, balloons: false, fireworks: false, floatingHearts: true, snow: false }
      }
    }
  ],
  anniversary: [
    {
      name: "Classic Silver",
      tagline: "Sophisticated and clean layout for milestones",
      icon: "🥈",
      previewColors: ["#C0C0C0", "#FAFAFA"],
      wishData: {
        templateId: "anniversary-1",
        occasion: "anniversary",
        title: "A Love That Inspires Us All",
        subtitle: "Happy Wedding Anniversary!",
        description: "Wishing you a beautiful day celebrating your love, commitment, and incredible journey together. May your bond grow stronger with each passing season.",
        quote: "Real love stories never have endings.",
        theme: "silver-white",
        colors: { primary: "#A1A1AA", secondary: "#F4F4F5", background: "#FAFAFA", text: "#18181B" },
        animation: { confetti: true, balloons: false, fireworks: false, floatingHearts: true, snow: false }
      }
    },
    {
      name: "Ruby Romance",
      tagline: "Warm, romantic crimson red style",
      icon: "❤️",
      previewColors: ["#DC2626", "#FEE2E2"],
      wishData: {
        templateId: "anniversary-2",
        occasion: "anniversary",
        title: "Through All the Years, Still You",
        subtitle: "Cheers to a lifetime of togetherness",
        description: "From the moment you met until today, you have built something truly beautiful. Happy Anniversary to the perfect couple!",
        theme: "ruby-red",
        colors: { primary: "#DC2626", secondary: "#EF4444", background: "#FFF5F5", text: "#7F1D1D" },
        animation: { confetti: false, balloons: false, fireworks: false, floatingHearts: true, snow: false }
      }
    },
    {
      name: "Golden Jubilee",
      tagline: "Sparkling gold look for major achievements",
      icon: "👑",
      previewColors: ["#D4AF37", "#FCF8E3"],
      wishData: {
        templateId: "anniversary-3",
        occasion: "anniversary",
        title: "Celebrating a Golden Milestone",
        subtitle: "Happy Golden Anniversary!",
        description: "Fifty years of building memories, sharing laughter, and walking hand-in-hand. Your relationship is a shining beacon of commitment.",
        theme: "gold-champagne",
        colors: { primary: "#D4AF37", secondary: "#F59E0B", background: "#FCFDF9", text: "#78350F" },
        animation: { confetti: true, balloons: false, fireworks: true, floatingHearts: false, snow: false }
      }
    },
    {
      name: "Modern Pearl",
      tagline: "Rose gold theme with subtle backdrop blur",
      icon: "🦪",
      previewColors: ["#B76E79", "#FFF0F5"],
      wishData: {
        templateId: "anniversary-4",
        occasion: "anniversary",
        title: "Happy Anniversary to My Favorite Couple!",
        subtitle: "Here's to the ultimate team",
        description: "To the couple who shows us what true partnership means. May your day be filled with warm cuddles, delicious food, and deep conversations.",
        theme: "rose-gold",
        colors: { primary: "#B76E79", secondary: "#C38B94", background: "#FFF5F6", text: "#5C3A40" },
        animation: { confetti: true, balloons: true, fireworks: false, floatingHearts: false, snow: false }
      }
    },
    {
      name: "Celestial Lovers",
      tagline: "Romantic dark sky theme filled with stars",
      icon: "🌌",
      previewColors: ["#1E3A8A", "#818CF8"],
      wishData: {
        templateId: "anniversary-5",
        occasion: "anniversary",
        title: "Written in the Stars",
        subtitle: "Celebrating your cosmic connection",
        description: "Your love story is written in the constellations. Wishing you a celestial anniversary full of magic, romance, and moonlit walks.",
        theme: "twilight-blue",
        colors: { primary: "#1E3A8A", secondary: "#818CF8", background: "#070F2B", text: "#FFFFFF" },
        animation: { confetti: false, balloons: false, fireworks: true, floatingHearts: true, snow: false }
      }
    }
  ],
  wedding: [
    {
      name: "Ethereal Ivory",
      tagline: "Elegant ivory white theme with gold borders",
      icon: "💍",
      previewColors: ["#FDFBF7", "#E5D3B3"],
      wishData: {
        templateId: "wedding-1",
        occasion: "wedding",
        title: "Congratulations on Your Wedding Day!",
        subtitle: "Two Hearts Become One Today",
        description: "Wishing you a lifetime of love, joy, and wonderful companionship as you begin this gorgeous new chapter together. Let the celebrations begin!",
        theme: "wedding-ivory",
        colors: { primary: "#D4AF37", secondary: "#FDFBF7", background: "#FAF8F5", text: "#332C22" },
        animation: { confetti: true, balloons: false, fireworks: false, floatingHearts: true, snow: false }
      }
    },
    {
      name: "Sage & Rose Boho",
      tagline: "Earthy tones for a modern bohemian marriage",
      icon: "🌿",
      previewColors: ["#8FBC8F", "#FFF5EE"],
      wishData: {
        templateId: "wedding-2",
        occasion: "wedding",
        title: "A Lifetime of Love Starts Today",
        subtitle: "Warmest wishes to the newlyweds",
        description: "May your home be filled with sunshine, your hearts be filled with music, and your life together be a sweet adventure.",
        theme: "boho-sage",
        colors: { primary: "#8FBC8F", secondary: "#BC8F8F", background: "#FAF7F2", text: "#2E3B2E" },
        animation: { confetti: true, balloons: false, fireworks: false, floatingHearts: false, snow: false }
      }
    },
    {
      name: "Sapphire Gold",
      tagline: "Deep royal blue mixed with warm gold details",
      icon: "💎",
      previewColors: ["#0F172A", "#F59E0B"],
      wishData: {
        templateId: "wedding-3",
        occasion: "wedding",
        title: "The Beginning of Forever",
        subtitle: "May your love grow stronger each day",
        description: "As you step into the world as husband and wife, may your bond be unbreakable, your laughter be loud, and your love be unconditional.",
        theme: "royal-blue",
        colors: { primary: "#1E3A8A", secondary: "#F59E0B", background: "#0B132B", text: "#FFFFFF" },
        animation: { confetti: false, balloons: false, fireworks: true, floatingHearts: false, snow: false }
      }
    },
    {
      name: "Vintage Blush",
      tagline: "Dusty rose and warm peach nostalgia",
      icon: "🌸",
      previewColors: ["#E8C5C8", "#FFF0F5"],
      wishData: {
        templateId: "wedding-4",
        occasion: "wedding",
        title: "Toast to the Beautiful Couple!",
        subtitle: "Cheers to love, laughter, and happily ever after",
        description: "Wishing you a wonderful celebration today and a bright future together. May every day you share be as magical as your wedding day.",
        theme: "blush-pink",
        colors: { primary: "#E8C5C8", secondary: "#D4A5A9", background: "#FFF5F6", text: "#4E3639" },
        animation: { confetti: true, balloons: true, fireworks: false, floatingHearts: false, snow: false }
      }
    },
    {
      name: "Minimalist Gold",
      tagline: "Sleek, modern layout with fine script fonts",
      icon: "⚜️",
      previewColors: ["#CFB997", "#FAFAFA"],
      wishData: {
        templateId: "wedding-5",
        occasion: "wedding",
        title: "Happy Married Life!",
        subtitle: "Best wishes on your journey together",
        description: "Simple wishes for a gorgeous couple: may your trust never fail, your passion never fade, and your love continue to grow forever.",
        theme: "gold-minimalist",
        colors: { primary: "#CFB997", secondary: "#E2D4C0", background: "#FAFAFA", text: "#1A1A1A" },
        animation: { confetti: true, balloons: false, fireworks: false, floatingHearts: false, snow: false }
      }
    }
  ],
  valentine: [
    {
      name: "Cupid's Crimson",
      tagline: "Vibrant crimson and heart overlays",
      icon: "💘",
      previewColors: ["#E11D48", "#FFF1F2"],
      wishData: {
        templateId: "valentine-1",
        occasion: "valentine",
        title: "You Have My Whole Heart",
        subtitle: "Happy Valentine's Day, My Love",
        description: "Every day with you feels like a dream. Thank you for filling my life with sweet romance, constant joy, and endless love.",
        quote: "In all the world, there is no heart for me like yours.",
        theme: "crimson-red",
        colors: { primary: "#E11D48", secondary: "#F43F5E", background: "#FFF1F2", text: "#881337" },
        animation: { confetti: false, balloons: false, fireworks: false, floatingHearts: true, snow: false }
      }
    },
    {
      name: "Velvet Romance",
      tagline: "Deep burgundy luxury with floating sparkles",
      icon: "🍷",
      previewColors: ["#880808", "#111111"],
      wishData: {
        templateId: "valentine-2",
        occasion: "valentine",
        title: "To My One and Only",
        subtitle: "You are my favorite place to be",
        description: "No distance, no obstacle, and no time can ever diminish the love I hold for you in my heart. Happy Valentine's Day!",
        theme: "burgundy-gold",
        colors: { primary: "#880808", secondary: "#D4AF37", background: "#0F0202", text: "#FFFFFF" },
        animation: { confetti: true, balloons: false, fireworks: false, floatingHearts: true, snow: false }
      }
    },
    {
      name: "Sweet Peach Love",
      tagline: "Warm pastel coral layout for friendly romance",
      icon: "🍑",
      previewColors: ["#F97316", "#FFEDD5"],
      wishData: {
        templateId: "valentine-3",
        occasion: "valentine",
        title: "You Make My Heart Skip a Beat",
        subtitle: "Happy Valentine's Day, Sweetheart",
        description: "I'm so incredibly lucky to walk through life with you by my side. Let's make today full of delicious treats and cute memories!",
        theme: "coral-peach",
        colors: { primary: "#F97316", secondary: "#FDBA74", background: "#FFF7ED", text: "#7C2D12" },
        animation: { confetti: false, balloons: true, fireworks: false, floatingHearts: true, snow: false }
      }
    },
    {
      name: "Cyber Neon Heart",
      tagline: "Glow aesthetic using magenta and neon cyan",
      icon: "⚡",
      previewColors: ["#FF007F", "#00FFFF"],
      wishData: {
        templateId: "valentine-4",
        occasion: "valentine",
        title: "Connected to You Always",
        subtitle: "My Digital Valentine",
        description: "Across any distance or server, my signals always lead back to you. You are the ping that lights up my network!",
        theme: "neon-cyber",
        colors: { primary: "#FF007F", secondary: "#00FFFF", background: "#0D0115", text: "#FFFFFF" },
        animation: { confetti: false, balloons: false, fireworks: true, floatingHearts: true, snow: false }
      }
    },
    {
      name: "Classic Letter",
      tagline: "Warm parchment paper background style",
      icon: "✉️",
      previewColors: ["#D2B48C", "#FDF5E6"],
      wishData: {
        templateId: "valentine-5",
        occasion: "valentine",
        title: "A Handwritten Note of Love",
        subtitle: "With all my fondness and adoration",
        description: "This is a simple letter to remind you of how much I cherish our time together. You are my greatest inspiration and comfort.",
        theme: "parchment-gold",
        colors: { primary: "#8B4513", secondary: "#D2B48C", background: "#FCF9F2", text: "#2B1B10" },
        animation: { confetti: false, balloons: false, fireworks: false, floatingHearts: true, snow: false }
      }
    }
  ],
  other: [
    {
      name: "Future Graduate",
      tagline: "Inspirational green & gold for graduation",
      icon: "🎓",
      previewColors: ["#059669", "#F59E0B"],
      wishData: {
        templateId: "other-1",
        occasion: "graduation",
        title: "Congratulations, Graduate!",
        subtitle: "The world is waiting for you",
        description: "Your diligence, late nights, and absolute focus have led to this amazing accomplishment. Wishing you unlimited heights in your professional career!",
        theme: "emerald-gold",
        colors: { primary: "#059669", secondary: "#F59E0B", background: "#F0FDF4", text: "#064E3B" },
        animation: { confetti: true, balloons: false, fireworks: true, floatingHearts: false, snow: false }
      }
    },
    {
      name: "Midnight Glow",
      tagline: "Spectacular fireworks for New Year wishes",
      icon: "🎆",
      previewColors: ["#FFD700", "#000000"],
      wishData: {
        templateId: "other-2",
        occasion: "new-year",
        title: "Happy New Year!",
        subtitle: "Cheers to 365 new opportunities",
        description: "Wishing you a sparkling, happy, and prosperous New year! May this year bring you closer to all your dreams and ambitions.",
        theme: "midnight-gold",
        colors: { primary: "#FFD700", secondary: "#C0C0C0", background: "#0A0A0A", text: "#FFFFFF" },
        animation: { confetti: true, balloons: false, fireworks: true, floatingHearts: false, snow: false }
      }
    },
    {
      name: "Winter Wonderland",
      tagline: "Forest green & red with falling snow effects",
      icon: "🎄",
      previewColors: ["#16A34A", "#DC2626"],
      wishData: {
        templateId: "other-3",
        occasion: "christmas",
        title: "Merry and Bright!",
        subtitle: "Wishing you a magical Christmas",
        description: "May your home be filled with warmth, your holiday tables filled with joy, and your winter filled with peace and cozy nights.",
        theme: "pine-red",
        colors: { primary: "#16A34A", secondary: "#DC2626", background: "#F0FDF4", text: "#14532D" },
        animation: { confetti: false, balloons: false, fireworks: false, floatingHearts: false, snow: true }
      }
    },
    {
      name: "Executive Climb",
      tagline: "Corporate slate & blue for promotions",
      icon: "📈",
      previewColors: ["#2563EB", "#F1F5F9"],
      wishData: {
        templateId: "other-4",
        occasion: "promotion",
        title: "Congratulations on the Promotion!",
        subtitle: "Well deserved and earned!",
        description: "Your dedication, leadership, and drive have led to this career leap. The team is proud of you and excited to see you conquer this new role!",
        theme: "professional-blue",
        colors: { primary: "#2563EB", secondary: "#3B82F6", background: "#F8FAFC", text: "#1E293B" },
        animation: { confetti: true, balloons: false, fireworks: false, floatingHearts: false, snow: false }
      }
    },
    {
      name: "Bonds of Gold",
      tagline: "Friendship yellow layout with happy sparkles",
      icon: "💛",
      previewColors: ["#EAB308", "#FEF08A"],
      wishData: {
        templateId: "other-5",
        occasion: "friendship",
        title: "To a Lifelong Friend",
        subtitle: "Thank you for always being my rock",
        description: "Through laughs, tears, and late-night calls, you have been the best friend anyone could ask for. Here's a little digital token to appreciate our bond!",
        theme: "sunburst-yellow",
        colors: { primary: "#EAB308", secondary: "#FACC15", background: "#FEFCE8", text: "#713F12" },
        animation: { confetti: false, balloons: true, fireworks: false, floatingHearts: true, snow: false }
      }
    }
  ]
};

export default function WishCreatePage() {
  const router = useRouter();

  // Selected occasion category state
  const [selectedCategory, setSelectedCategory] = useState<
    "birthday" | "anniversary" | "wedding" | "valentine" | "other"
  >("birthday");

  // Selected template index state
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number | null>(null);

  // Form step state
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Core Form State (directly maps to Wish type)
  const [wishForm, setWishForm] = useState<Wish>({
    id: Math.random().toString(36).substring(2, 9),
    slug: "",
    templateId: "birthday-5",
    occasion: "birthday",
    title: "",
    subtitle: "",
    description: "",
    recipient: { name: "", nickname: "", relation: "", avatar: "" },
    sender: { name: "", avatar: "", anonymous: false },
    messages: [""],
    quote: "",
    poem: "",
    coverImage: "/images/covers/default.jpg",
    profileImage: "",
    gallery: [],
    video: "",
    voiceMessage: "",
    music: "",
    theme: "default",
    colors: { primary: "#673ab7", secondary: "#e91e63", background: "#ffffff", text: "#000000" },
    font: "var(--font-geist-sans)",
    animation: { confetti: false, balloons: false, fireworks: false, floatingHearts: false, snow: false },
    countdown: { enabled: false, targetDate: "" },
    isPublic: true,
    allowComments: true,
    allowReactions: true,
    views: 0,
    reactions: 0,
    shares: 0,
    createdAt: new Date().toISOString().split("T")[0],
    updatedAt: new Date().toISOString().split("T")[0],
  });

  // Preview overlay state
  const [previewWish, setPreviewWish] = useState<Wish | null>(null);

  useEffect(() => {
    document.title = "Design a New Digital Wish Card | Wishey";
  }, []);

  // Handle template selection and pre-fill form
  const applyTemplate = (template: WishTemplate, index: number) => {
    setSelectedTemplateIndex(index);
    setWishForm((prev) => ({
      ...prev,
      ...template.wishData,
      occasion: template.wishData.occasion as any,
      slug: (template.wishData.title || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, ""),
    }));
    toast.success(`Applied "${template.name}" Template!`);
  };

  // Pre-fill helper that merges the selected template styles with the current form fields, for live previews
  const generatePreviewData = (template: WishTemplate): Wish => {
    return {
      ...wishForm,
      ...template.wishData,
      // Merge with user entered fields so they render in real-time
      recipient: {
        ...template.wishData.recipient,
        name: wishForm.recipient.name || "[Recipient Name]",
        nickname: wishForm.recipient.nickname || "[Nickname]",
        relation: wishForm.recipient.relation || "[Relation]",
      },
      sender: {
        ...template.wishData.sender,
        name: wishForm.sender.anonymous ? "Anonymous" : (wishForm.sender.name || "[Sender Name]"),
        anonymous: wishForm.sender.anonymous,
      },
      // Fallback message rendering if empty
      messages: wishForm.messages.filter(m => m).length > 0
        ? wishForm.messages
        : (template.wishData.messages || ["Sample message: Hope you have a wonderful celebration!"]),
    };
  };

  // Helper to handle text fields
  const updateTextField = (path: string, val: any) => {
    setWishForm((prev) => {
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
    setWishForm((prev) => {
      const updatedMessages = [...prev.messages];
      updatedMessages[index] = val;
      return {
        ...prev,
        messages: updatedMessages,
      };
    });
  };

  const addMessageField = () => {
    setWishForm((prev) => ({
      ...prev,
      messages: [...prev.messages, ""],
    }));
  };

  const removeMessageField = (index: number) => {
    if (wishForm.messages.length <= 1) return;
    setWishForm((prev) => {
      const updated = [...prev.messages];
      updated.splice(index, 1);
      return {
        ...prev,
        messages: updated,
      };
    });
  };

  // Submit and Save Wish
  const handleCreateWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishForm.title || !wishForm.recipient.name) {
      toast.error("Please fill in the Wish Title and Recipient Name.");
      return;
    }

    const toastId = toast.loading("Creating your digital wish card...");
    
    try {
      const response = await fetch("/api/wish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(wishForm),
      });
      const result = await response.json();
      
      if (result.success) {
        toast.success("Congratulations! Your digital wish has been created.", { id: toastId });
        router.push("/wish/list");
      } else {
        toast.error(result.message || "Failed to create wish in database.", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error. Please try again.", { id: toastId });
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] p-4 md:p-10 max-w-7xl mx-auto flex flex-col gap-8">
      {/* Header section */}
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div className="space-y-1">
          <Link href="/" className="text-muted-foreground text-sm font-semibold hover:text-foreground flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className="text-3xl font-black tracking-tight mt-1">
            Create a New <span className="text-brand-gradient">Wish</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Step {currentStep} of 4: Customize details, animations, and layouts.
          </p>
        </div>
      </div>

      {/* STEP 1: Select Category and Predefined Template */}
      {currentStep === 1 && (
        <div className="flex flex-col gap-8">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Stars className="text-primary w-6 h-6 animate-pulse" /> Step 1: Pick Occasion & Design Template
            </h2>
            <p className="text-muted-foreground text-sm">
              Select one of the major occasions below. We will offer 5 pre-made design templates featuring premium content, color themes, and special animations to bootstrap your design.
            </p>
          </div>

          {/* Occasion Selector Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {(
              [
                { id: "birthday", name: "Birthday", emoji: "🎂", class: "from-amber-400 to-orange-500" },
                { id: "anniversary", name: "Anniversary", emoji: "💖", class: "from-pink-500 to-rose-600" },
                { id: "wedding", name: "Wedding", emoji: "💍", class: "from-sky-400 to-indigo-500" },
                { id: "valentine", name: "Valentine", emoji: "💝", class: "from-red-500 to-pink-500" },
                { id: "other", name: "Other Events", emoji: "✨", class: "from-emerald-400 to-teal-500" },
              ] as const
            ).map((cat) => (
              <div
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setSelectedTemplateIndex(null);
                }}
                className={`relative p-6 rounded-2xl border text-center cursor-pointer transition-all duration-300 flex flex-col justify-center items-center gap-2 group hover:shadow-md ${
                  selectedCategory === cat.id
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20 scale-102"
                    : "border-border bg-card"
                }`}
              >
                <div className={`w-12 h-12 rounded-full bg-linear-to-br ${cat.class} flex items-center justify-center text-white text-2xl shadow-sm group-hover:scale-110 transition-transform`}>
                  {cat.emoji}
                </div>
                <h4 className="font-bold text-sm mt-1">{cat.name}</h4>
              </div>
            ))}
          </div>

          {/* 5 Templates Grid */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-muted-foreground">Available Templates for {selectedCategory.toUpperCase()}</h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {TEMPLATES_RECORD[selectedCategory].map((tmpl, idx) => (
                <Card
                  key={idx}
                  variant={selectedTemplateIndex === idx ? "neon" : "glass"}
                  glowColor="var(--primary)"
                  className={`flex flex-col justify-between p-5 min-h-[16.5rem] transition-all cursor-default border ${
                    selectedTemplateIndex === idx ? "border-primary ring-2 ring-primary/20" : "border-border/60"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">{tmpl.icon}</span>
                      {/* Color Preview Dots */}
                      <div className="flex gap-1.5 bg-muted p-1 rounded-full">
                        {tmpl.previewColors.map((color, cIdx) => (
                          <div
                            key={cIdx}
                            className="w-3.5 h-3.5 rounded-full border border-white/20"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-extrabold text-base line-clamp-1">{tmpl.name}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-3 mt-1.5 leading-relaxed">
                        {tmpl.tagline}
                      </p>
                    </div>
                  </div>
                  
                  {/* Action buttons inside Card */}
                  <div className="flex gap-2 mt-4">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => applyTemplate(tmpl, idx)}
                      className={`flex-1 text-xs font-bold py-1 bg-primary text-white cursor-pointer`}
                    >
                      {selectedTemplateIndex === idx ? "Applied" : "Apply"}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setPreviewWish(generatePreviewData(tmpl))}
                      className="px-2.5 text-xs font-bold border-border/80 flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" /> Preview
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Stepper Navigation */}
          <div className="flex justify-end pt-4 border-t border-border mt-4">
            <Button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="flex items-center gap-1.5 bg-primary text-primary-foreground font-bold shadow-md cursor-pointer"
            >
              Continue to Details <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: Recipient and Sender Info */}
      {currentStep === 2 && (
        <div className="max-w-2xl mx-auto w-full bg-white/40 dark:bg-black/20 border border-border rounded-3xl p-6 md:p-8 shadow-xl flex flex-col gap-6">
          <h2 className="text-xl font-bold flex items-center gap-2 border-b border-border pb-3">
            <User className="text-primary w-5 h-5" /> Step 2: Recipient & Sender Information
          </h2>

          <div className="grid gap-6">
            {/* Recipient info */}
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold text-primary uppercase tracking-wider">Recipient Info</h3>
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
                <h3 className="text-sm font-extrabold text-primary uppercase tracking-wider">Sender Info</h3>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="send-anon"
                    checked={wishForm.sender.anonymous || false}
                    onCheckedChange={(checked) => updateTextField("sender.anonymous", !!checked)}
                  />
                  <Label htmlFor="send-anon" className="cursor-pointer text-xs font-semibold">Send anonymously</Label>
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
              Continue to Content <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: Customize Message and Content */}
      {currentStep === 3 && (
        <div className="max-w-3xl mx-auto w-full bg-white/40 dark:bg-black/20 border border-border rounded-3xl p-6 md:p-8 shadow-xl flex flex-col gap-6">
          <h2 className="text-xl font-bold flex items-center gap-2 border-b border-border pb-3">
            <Smile className="text-primary w-5 h-5" /> Step 3: Card Content & Messages
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
                <Label className="text-sm font-extrabold text-primary uppercase tracking-wider">Messages List</Label>
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
              onClick={() => setCurrentStep(2)}
              className="flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" /> Back to Step 2
            </Button>
            <Button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="flex items-center gap-1.5 bg-primary text-primary-foreground font-bold shadow-md cursor-pointer"
            >
              Continue to Styling <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: Style, Animations and Countdown */}
      {currentStep === 4 && (
        <form onSubmit={handleCreateWish} className="max-w-3xl mx-auto w-full bg-white/40 dark:bg-black/20 border border-border rounded-3xl p-6 md:p-8 shadow-xl flex flex-col gap-6">
          <h2 className="text-xl font-bold flex items-center gap-2 border-b border-border pb-3">
            <Sparkles className="text-primary w-5 h-5" /> Step 4: Appearance & Animations
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
              <Label className="text-sm font-extrabold text-primary uppercase tracking-wider block">Special Effects & Animations</Label>
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
                          ...prev,
                          animation: {
                            ...(prev.animation || {}),
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
                <Label className="text-sm font-extrabold text-primary uppercase tracking-wider">Countdown Clock</Label>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="cd-enabled"
                    checked={wishForm.countdown?.enabled || false}
                    onCheckedChange={(checked) => {
                      setWishForm((prev) => ({
                        ...prev,
                        countdown: {
                          enabled: !!checked,
                          targetDate: prev.countdown?.targetDate || "",
                        },
                      }));
                    }}
                  />
                  <Label htmlFor="cd-enabled" className="cursor-pointer text-xs font-semibold">Enable countdown</Label>
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
                        ...prev,
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
              onClick={() => setCurrentStep(3)}
              className="flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" /> Back to Step 3
            </Button>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setPreviewWish(wishForm)}
                className="flex items-center gap-1.5 border-border/80 cursor-pointer"
              >
                <Eye className="w-5 h-5" /> Live Preview
              </Button>
              <Button
                type="submit"
                className="flex items-center gap-2 bg-brand-gradient hover:opacity-90 text-white font-bold shadow-brand border-0 cursor-pointer"
              >
                Create Digital Wish Card <Gift className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* FULL-SCREEN TEMPLATE PREVIEW MODAL */}
      {previewWish && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 overflow-y-auto flex flex-col">
          {/* Top Bar inside Preview Modal */}
          <div className="bg-neutral-900/90 text-white border-b border-neutral-800 p-4 sticky top-0 flex items-center justify-between z-50">
            <div className="flex items-center gap-2">
              <span className="bg-primary/20 text-primary-foreground text-xs px-2.5 py-1 rounded-full font-bold">
                Live Rendering Preview
              </span>
              <span className="text-xs text-neutral-400 font-mono hidden sm:inline">
                Template ID: {previewWish.templateId || "default"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => {
                  setWishForm(previewWish);
                  setPreviewWish(null);
                  toast.success("Applied and locked template styling!");
                }}
                className="bg-primary hover:bg-primary/95 text-white font-bold text-xs"
              >
                Apply Styling
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setPreviewWish(null)}
                className="text-neutral-400 hover:text-white p-2"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Renders the selected unique template component merged with custom fields! */}
          <div className="flex-1 w-full bg-background overflow-y-auto">
            <WishTemplateRenderer wish={previewWish} previewMode={true} />
          </div>
        </div>
      )}
    </div>
  );
}

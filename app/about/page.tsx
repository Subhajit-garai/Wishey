import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Sparkles, Heart, ShieldCheck, Gift } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Wishey",
  description: "Learn about Wishey - the free interactive digital wishing card and celebration platform.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 md:px-8 space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-semibold"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <div className="space-y-3 border-b border-border pb-6">
        <h1 className="text-3xl font-black tracking-tight">About <span className="text-brand-gradient">Wishey</span></h1>
        <p className="text-sm text-muted-foreground">
          Spreading joy, celebration, and love through interactive digital wishing cards.
        </p>
      </div>

      <div className="space-y-8 text-sm leading-relaxed text-foreground/90">
        <p className="text-base leading-relaxed">
          <strong>Wishey</strong> is a modern web application designed to help people send heartfelt, animated, and interactive digital greeting cards to their loved ones across the globe. Whether it&apos;s a Birthday, Anniversary, Wedding, or Graduation, Wishey makes celebrations memorable.
        </p>

        <div className="grid sm:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl border border-border bg-card space-y-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <h3 className="font-bold text-base">Beautiful Designs</h3>
            <p className="text-xs text-muted-foreground">
              Choose from 25+ curated templates with 3D animations, music, and interactive overlays.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-border bg-card space-y-2">
            <Heart className="w-6 h-6 text-pink-500" />
            <h3 className="font-bold text-base">100% Free to Use</h3>
            <p className="text-xs text-muted-foreground">
              We keep Wishey accessible to everyone supported by subtle non-intrusive sponsorships.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-border bg-card space-y-2">
            <ShieldCheck className="w-6 h-6 text-emerald-500" />
            <h3 className="font-bold text-base">Privacy & Quality</h3>
            <p className="text-xs text-muted-foreground">
              Your wishes are stored safely and encrypted with clean web design standards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

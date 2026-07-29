import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | Wishey",
  description: "Terms of Service governing the use of Wishey digital wishing card platform.",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 md:px-8 space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-semibold"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <div className="space-y-3 border-b border-border pb-6">
        <h1 className="text-3xl font-black tracking-tight">Terms of Service</h1>
        <p className="text-sm text-muted-foreground">
          Last Updated: July 2026 • Platform Terms & Content Guidelines
        </p>
      </div>

      <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed space-y-6 text-foreground/90">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">1. Acceptance of Terms</h2>
          <p>
            By accessing and using <strong>Wishey</strong>, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">2. User-Generated Content</h2>
          <p>
            Users are solely responsible for the wishing cards, messages, images, and content they create or upload on Wishey. You agree not to upload content that is illegal, defamatory, offensive, or infringes on intellectual property rights.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">3. Fair Use & Free Services</h2>
          <p>
            Wishey provides digital wishing cards free of charge. Creation tokens or features may be made available through standard platform interaction or ad sponsorships.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">4. Limitation of Liability</h2>
          <p>
            Wishey is provided &quot;as is&quot; without warranties of any kind. We are not liable for any damages resulting from the use or inability to use our services.
          </p>
        </section>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Wishey",
  description: "Wishey Privacy Policy disclosing cookie usage, Google AdSense ads, third-party vendor tracking, and user data protections.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 md:px-8 space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-semibold"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <div className="space-y-3 border-b border-border pb-6">
        <h1 className="text-3xl font-black tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">
          Last Updated: July 2026 • Disclosure of Data Practices & Google AdSense Compliance
        </p>
      </div>

      <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed space-y-6 text-foreground/90">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">1. Introduction</h2>
          <p>
            Welcome to <strong>Wishey</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We respect your privacy and are committed to protecting personal data. This Privacy Policy explains how we collect, use, and disclose information when you use our interactive digital wishing card platform.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">2. Google AdSense & Third-Party Advertising</h2>
          <p>
            We use <strong>Google AdSense</strong> to serve advertisements when you visit our website. Google and third-party vendors use cookies to serve ads based on your prior visits to our website or other websites on the internet.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>
              Google&apos;s use of advertising cookies enables it and its partners to serve ads to users based on their visit to our sites and/or other sites on the Internet.
            </li>
            <li>
              Users may opt out of personalized advertising by visiting{" "}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noreferrer"
                className="text-primary underline"
              >
                Google Ads Settings
              </a>.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">3. Information We Collect</h2>
          <p>We may collect information you voluntarily provide when creating cards or accounts, including:</p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>Account details (name, email address).</li>
            <li>Card content (recipient names, custom messages, uploaded images).</li>
            <li>Technical usage data (IP addresses, browser type, device identifiers).</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">4. Cookies and Web Beacons</h2>
          <p>
            Like any other website, Wishey uses &apos;cookies&apos;. These cookies are used to store information including visitors&apos; preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users&apos; experience by customizing our web page content based on visitors&apos; browser type and/or other information.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">5. Contact Us</h2>
          <p>
            If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us through our website.
          </p>
        </section>
      </div>
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="w-full border-t border-border/40 bg-card/60 backdrop-blur-md mt-auto py-10 px-4 md:px-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8 items-start md:items-center">
        {/* Brand Info */}
        <div className="space-y-2 max-w-sm">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.svg" alt="Wishey Logo" width={32} height={32} />
            <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              Wishey
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Create, customize, and share interactive digital wishing cards for birthdays, anniversaries, weddings, and special milestones.
          </p>
        </div>

        {/* Quick Links for AdSense Compliance */}
        <div className="flex flex-wrap gap-6 text-xs text-muted-foreground font-semibold">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <Link href="/wish/list" className="hover:text-foreground transition-colors">
            My Wishes
          </Link>
          <Link href="/about" className="hover:text-foreground transition-colors">
            About Us
          </Link>
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-foreground transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-border/30 flex flex-col sm:flex-row justify-between items-center text-[11px] text-muted-foreground gap-2">
        <p>© {new Date().getFullYear()} Wishey. All rights reserved.</p>
        <p>Protected by AdSense & Standard Web Privacy Guidelines.</p>
      </div>
    </footer>
  );
};

export default Footer;

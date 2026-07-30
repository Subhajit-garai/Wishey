"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle } from "lucide-react";

export type AdStatus = "loading" | "loaded" | "unfilled" | "error" | "unconfigured";

interface AdBannerProps {
  dataAdSlot?: string;
  dataAdFormat?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
  dataFullWidthResponsive?: boolean;
  className?: string;
  onAdStatusChange?: (status: AdStatus) => void;
}

export const AdBanner = ({
  dataAdSlot = "1234567890", // Replace with your real Google AdSense Slot ID
  dataAdFormat = "auto",
  dataFullWidthResponsive = true,
  className = "",
  onAdStatusChange,
}: AdBannerProps) => {
  const clientPublisherId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const insRef = useRef<HTMLModElement | null>(null);

  useEffect(() => {
    if (!clientPublisherId) {
      onAdStatusChange?.("unconfigured");
      return;
    }

    onAdStatusChange?.("loading");

    try {
      if (typeof window !== "undefined") {
        // @ts-expect-error Google Adsense push requirement
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error("AdSense Error:", err);
      onAdStatusChange?.("error");
      return;
    }

    const insElement = insRef.current;
    if (!insElement) return;

    const observer = new MutationObserver(() => {
      const status = insElement.getAttribute("data-ad-status");
      if (status === "filled") {
        onAdStatusChange?.("loaded");
      } else if (status === "unfilled") {
        onAdStatusChange?.("unfilled");
      }
    });

    observer.observe(insElement, {
      attributes: true,
      attributeFilter: ["data-ad-status"],
    });

    const timer = setTimeout(() => {
      const status = insElement.getAttribute("data-ad-status");
      if (status === "filled") {
        onAdStatusChange?.("loaded");
      } else if (status === "unfilled") {
        onAdStatusChange?.("unfilled");
      } else if (!insElement.querySelector("iframe") && insElement.children.length === 0) {
        onAdStatusChange?.("error");
      }
    }, 3500);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [clientPublisherId, onAdStatusChange]);

  // If no AdSense Client ID set, display a clear warning banner
  if (!clientPublisherId) {
    return (
      <div
        className={`w-full my-4 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-center text-xs text-amber-600 dark:text-amber-400 flex flex-col items-center justify-center gap-1.5 ${className}`}
      >
        <AlertTriangle className="w-5 h-5 text-amber-500" />
        <span className="font-bold text-sm">AdSense Not Verified / Configured</span>
        <span className="text-muted-foreground text-[11px]">
          (AdSense Client ID missing or pending domain verification. Ads cannot play.)
        </span>
      </div>
    );
  }

  return (
    <div className={`w-full my-4 overflow-hidden text-center ${className}`}>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={clientPublisherId}
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive ? "true" : "false"}
      />
    </div>
  );
};

export default AdBanner;

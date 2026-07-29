"use client";

import { useEffect } from "react";

interface AdBannerProps {
  dataAdSlot?: string;
  dataAdFormat?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
  dataFullWidthResponsive?: boolean;
  className?: string;
}

export const AdBanner = ({
  dataAdSlot = "1234567890", // Replace with your real Google AdSense Slot ID
  dataAdFormat = "auto",
  dataFullWidthResponsive = true,
  className = "",
}: AdBannerProps) => {
  const clientPublisherId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && clientPublisherId) {
        // @ts-expect-error Google Adsense push requirement
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error("AdSense Error:", err);
    }
  }, [clientPublisherId]);

  // If no AdSense Client ID set, display a subtle styled placeholder for local development
  if (!clientPublisherId) {
    return (
      <div
        className={`w-full my-6 p-4 rounded-xl border border-dashed border-border bg-muted/30 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-1 ${className}`}
      >
        <span className="font-semibold text-primary/80">
          Advertisement Space
        </span>
        <span>(Configuration Error : Ads Client id not Found)</span>
      </div>
    );
  }
  return (
    <div className={`w-full my-6 overflow-hidden text-center ${className}`}>
      <ins
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

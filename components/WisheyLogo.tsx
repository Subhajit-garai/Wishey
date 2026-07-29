import React from "react";

interface WisheyLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const WisheyLogo: React.FC<WisheyLogoProps> = ({
  className = "",
  size = 40,
  showText = false,
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 hover:scale-105"
      >
        <defs>
          {/* Background Gradient matching Wishey theme */}
          <linearGradient
            id="wishey-bg-grad"
            x1="0"
            y1="0"
            x2="512"
            y2="512"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="45%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>

          {/* Warm Sparkling Gold Star Gradient */}
          <linearGradient id="wishey-star-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFF59D" />
            <stop offset="50%" stopColor="#FACC15" />
            <stop offset="100%" stopColor="#FB923C" />
          </linearGradient>

          {/* Crisp White Ribbon Gradient */}
          <linearGradient
            id="wishey-w-grad"
            x1="0"
            y1="0"
            x2="0"
            y2="512"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F3E8FF" />
          </linearGradient>

          {/* Soft Glow Filter */}
          <filter
            id="wishey-glow"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
            filterUnits="userSpaceOnUse"
          >
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feComponentTransfer in="blur" result="glow">
              <feFuncA type="linear" slope="0.5" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background Squircle Container */}
        <rect
          x="32"
          y="32"
          width="448"
          height="448"
          rx="112"
          fill="url(#wishey-bg-grad)"
        />

        {/* Subtle Glass Border */}
        <rect
          x="32"
          y="32"
          width="448"
          height="448"
          rx="112"
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity="0.25"
          strokeWidth="4"
        />

        {/* Wishey Ribbon 'W' */}
        <g filter="url(#wishey-glow)">
          <path
            d="M 120 170 
               C 120 155, 138 148, 148 160 
               L 196 230 
               L 242 162 
               C 248 153, 262 153, 268 162 
               L 314 230 
               L 362 160 
               C 372 148, 390 155, 390 170 
               L 348 340 
               C 344 358, 320 364, 308 348 
               L 255 272 
               L 202 348 
               C 190 364, 166 358, 162 340 
               Z"
            fill="url(#wishey-w-grad)"
          />
        </g>

        {/* Main Sparkling Wish Star (Top Right) */}
        <g filter="url(#wishey-glow)">
          <path
            d="M 376 100 C 376 128, 392 144, 420 144 C 392 144, 376 160, 376 188 C 376 160, 360 144, 332 144 C 360 144, 376 128, 376 100 Z"
            fill="url(#wishey-star-grad)"
          />
          <path
            d="M 376 118 C 376 134, 384 144, 400 144 C 384 144, 376 154, 376 170 C 376 154, 368 144, 352 144 C 368 144, 376 134, 376 118 Z"
            fill="#FFFFFF"
          />
        </g>

        {/* Secondary Magic Sparkle (Top Left) */}
        <path
          d="M 136 104 C 136 118, 144 126, 158 126 C 144 126, 136 134, 136 148 C 136 134, 128 126, 114 126 C 128 126, 136 118, 136 104 Z"
          fill="url(#wishey-star-grad)"
          opacity="0.9"
        />

        {/* Tiny Sparkle (Bottom Right) */}
        <path
          d="M 390 370 C 390 380, 396 386, 406 386 C 396 386, 390 392, 390 402 C 390 392, 384 386, 374 386 C 384 386, 390 380, 390 370 Z"
          fill="#FFFFFF"
          opacity="0.8"
        />
      </svg>
      {showText && (
        <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight">
          Wishey
        </span>
      )}
    </div>
  );
};

export default WisheyLogo;

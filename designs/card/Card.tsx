"use client";

import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onDrag' | 'onDragStart' | 'onDragEnd'> {
  children?: ReactNode;
  hoverEffect?: boolean;
  variant?: 'default' | 'glass' | 'gradient' | 'neon';
  glowColor?: string;
}

export const Card = ({
  children,
  className,
  hoverEffect = true,
  variant = 'default',
  glowColor = 'var(--primary)',
  ...props
}: CardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'glass':
        return 'bg-white/50 dark:bg-black/30 backdrop-blur-xl border border-white/30 dark:border-white/10 shadow-[0_8px_32px_0_rgba(142,150,220,0.08)]';
      case 'gradient':
        return 'bg-linear-to-br from-card to-secondary/15 border border-primary/20 shadow-md';
      case 'neon':
        return 'bg-card border border-primary/30 shadow-[0_0_15px_-3px_color-mix(in_oklab,var(--primary)_15%,transparent)]';
      default:
        return 'bg-card border border-border shadow-xs';
    }
  };

  return (
    <motion.div
      {...(props as any)}
      whileHover={hoverEffect ? {
        y: -6,
        scale: 1.025,
        boxShadow: variant === 'neon'
          ? `0 15px 30px -10px color-mix(in oklab, ${glowColor} 30%, transparent), 0 0 25px 2px color-mix(in oklab, ${glowColor} 20%, transparent)`
          : variant === 'glass'
          ? `0 20px 40px -10px color-mix(in oklab, var(--primary) 12%, transparent), 0 0 15px -3px color-mix(in oklab, var(--accent) 10%, transparent)`
          : '0 20px 40px -15px rgba(0, 0, 0, 0.1)',
      } : {}}
      whileTap={hoverEffect ? { scale: 0.98 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={cn(
        "relative flex flex-col w-full rounded-2xl p-6 transition-all duration-300 overflow-hidden group select-none cursor-pointer",
        getVariantStyles(),
        className
      )}
    >
      {/* Decorative gradient overlay */}
      {hoverEffect && (
        <div 
          className="absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
          style={{
            background: `radial-gradient(250px circle at 50% 50%, color-mix(in oklab, ${glowColor} 12%, transparent), transparent 70%)`
          }}
        />
      )}
      <div className="relative z-10 flex flex-col h-full w-full">
        {children}
      </div>
    </motion.div>
  );
};

export default Card;

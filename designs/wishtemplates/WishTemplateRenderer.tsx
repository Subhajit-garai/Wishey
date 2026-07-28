"use client";

import React from "react";
import { type Wish } from "@/app/wish/types";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { Heart, Sparkles, Gift, Calendar, User, Clock, MessageSquare, GraduationCap, Award, TreePine, Moon } from "lucide-react";

// CSS Ambient animations keyframes injected dynamically
const AnimationStyles = () => (
  <style jsx global>{`
    @keyframes float-heart {
      0% { transform: translateY(100vh) scale(0.5) rotate(0deg); opacity: 0; }
      10% { opacity: 0.8; }
      90% { opacity: 0.8; }
      100% { transform: translateY(-10vh) scale(1.2) rotate(360deg); opacity: 0; }
    }
    @keyframes float-balloon {
      0% { transform: translateY(100vh) translateX(0); }
      50% { transform: translateY(50vh) translateX(30px); }
      100% { transform: translateY(-10vh) translateX(-30px); }
    }
    @keyframes falling-snow {
      0% { transform: translateY(-10vh) translateX(0); opacity: 0.8; }
      100% { transform: translateY(110vh) translateX(50px); opacity: 0.2; }
    }
    @keyframes firework-burst {
      0% { transform: scale(0.1); opacity: 1; }
      80% { opacity: 0.8; }
      100% { transform: scale(1.5); opacity: 0; }
    }
    .animate-float-heart {
      animation: float-heart 8s linear infinite;
    }
    .animate-float-balloon {
      animation: float-balloon 12s ease-in-out infinite;
    }
    .animate-snow {
      animation: falling-snow 10s linear infinite;
    }
    .animate-firework {
      animation: firework-burst 2s ease-out infinite;
    }
  `}</style>
);

// Particle components for ambient animations
const AmbientParticles = ({ animation }: { animation?: Wish["animation"] }) => {
  if (!animation) return null;
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Floating Hearts */}
      {animation.floatingHearts &&
        Array.from({ length: 15 }).map((_, i) => (
          <div
            key={`heart-${i}`}
            className="absolute text-red-500 animate-float-heart"
            style={{
              left: `${Math.random() * 95}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 6}s`,
              fontSize: `${16 + Math.random() * 24}px`,
            }}
          >
            ♥
          </div>
        ))}

      {/* Floating Balloons */}
      {animation.balloons &&
        Array.from({ length: 10 }).map((_, i) => {
          const colors = ["bg-red-400", "bg-blue-400", "bg-yellow-400", "bg-pink-400", "bg-purple-400"];
          const selectedColor = colors[i % colors.length];
          return (
            <div
              key={`balloon-${i}`}
              className={cn("absolute rounded-full w-12 h-16 opacity-75 animate-float-balloon flex flex-col items-center", selectedColor)}
              style={{
                left: `${10 + Math.random() * 80}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${10 + Math.random() * 8}s`,
              }}
            >
              {/* String */}
              <div className="w-0.5 h-12 bg-neutral-400 mt-16" />
            </div>
          );
        })}

      {/* Falling Snow */}
      {animation.snow &&
        Array.from({ length: 30 }).map((_, i) => (
          <div
            key={`snow-${i}`}
            className="absolute bg-white rounded-full animate-snow text-white"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 5}px`,
              height: `${2 + Math.random() * 5}px`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${8 + Math.random() * 6}s`,
            }}
          />
        ))}

      {/* Fireworks Bursts */}
      {animation.fireworks &&
        Array.from({ length: 6 }).map((_, i) => (
          <div
            key={`firework-${i}`}
            className="absolute rounded-full border border-dashed border-amber-300 animate-firework flex items-center justify-center"
            style={{
              left: `${15 + Math.random() * 70}%`,
              top: `${15 + Math.random() * 60}%`,
              width: "100px",
              height: "100px",
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          >
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
          </div>
        ))}

      {/* Confetti (Simulated with colorful falling blocks) */}
      {animation.confetti &&
        Array.from({ length: 25 }).map((_, i) => {
          const colors = ["bg-yellow-400", "bg-red-400", "bg-blue-400", "bg-green-400", "bg-pink-400"];
          const selectedColor = colors[i % colors.length];
          return (
            <div
              key={`confetti-${i}`}
              className={cn("absolute rounded-xs animate-snow", selectedColor)}
              style={{
                left: `${Math.random() * 100}%`,
                width: `${4 + Math.random() * 6}px`,
                height: `${6 + Math.random() * 10}px`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${4 + Math.random() * 4}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          );
        })}
    </div>
  );
};

// Countdown Timer UI
const CountdownTimer = ({ countdown }: { countdown?: Wish["countdown"] }) => {
  if (!countdown?.enabled || !countdown.targetDate) return null;

  return (
    <div className="w-full max-w-sm mx-auto bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center flex flex-col gap-2 mt-6">
      <div className="text-xs font-bold uppercase tracking-widest text-primary flex items-center justify-center gap-1.5">
        <Clock className="w-3.5 h-3.5 animate-spin" /> Unlocking Occasion In
      </div>
      <div className="grid grid-cols-4 gap-2 text-center mt-1">
        <div className="bg-background/40 p-2 rounded-lg"><span className="block font-black text-lg">02</span><span className="text-[10px] text-muted-foreground uppercase">Days</span></div>
        <div className="bg-background/40 p-2 rounded-lg"><span className="block font-black text-lg">14</span><span className="text-[10px] text-muted-foreground uppercase">Hours</span></div>
        <div className="bg-background/40 p-2 rounded-lg"><span className="block font-black text-lg">45</span><span className="text-[10px] text-muted-foreground uppercase">Mins</span></div>
        <div className="bg-background/40 p-2 rounded-lg"><span className="block font-black text-lg">10</span><span className="text-[10px] text-muted-foreground uppercase">Secs</span></div>
      </div>
    </div>
  );
};

interface Props {
  wish: Wish;
  previewMode?: boolean;
}

export const WishTemplateRenderer = ({ wish, previewMode = false }: Props) => {
  const { templateId, title, subtitle, description, recipient, sender, quote, poem, messages, countdown } = wish;

  // Render Birthday Layouts
  const renderBirthday = () => {
    switch (templateId) {
      case "birthday-1": // Golden Celebration
        return (
          <div className="w-full min-h-screen bg-neutral-950 text-white flex flex-col justify-center items-center p-6 font-serif relative overflow-hidden">
            <AmbientParticles animation={wish.animation} />
            <div className="max-w-xl w-full text-center space-y-8 z-10 border border-amber-400/30 p-10 rounded-3xl bg-neutral-900/90 shadow-2xl relative">
              <div className="absolute top-4 right-4 text-amber-400 text-sm tracking-wider font-sans uppercase">VIP Invitation</div>
              <div className="w-16 h-16 rounded-full bg-amber-400/10 flex items-center justify-center mx-auto text-amber-400 border border-amber-400/40">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 tracking-tight">
                  {title || "Happy Birthday!"}
                </h1>
                <p className="text-amber-300 font-sans tracking-wide text-sm">{subtitle}</p>
              </div>
              <p className="text-neutral-300 leading-relaxed text-base italic">{description}</p>
              
              {quote && (
                <div className="border-y border-amber-400/20 py-4 text-sm text-amber-200/90 italic">
                  "{quote}"
                </div>
              )}

              <div className="space-y-4 text-left font-sans">
                <h3 className="text-xs uppercase tracking-wider text-amber-400 font-bold">Wishes from Friends:</h3>
                <div className="grid gap-3">
                  {messages.filter(m => m).map((msg, i) => (
                    <div key={i} className="bg-neutral-800/80 p-4 rounded-xl border border-amber-400/10 hover:border-amber-400/30 transition-all text-sm leading-relaxed">
                      "{msg}"
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-neutral-800 pt-6 flex justify-between items-center text-xs font-sans text-neutral-400">
                <span>To: <strong className="text-amber-300 text-sm">{recipient.name}</strong></span>
                <span>From: <strong className="text-amber-300 text-sm">{sender.anonymous ? "Anonymous" : sender.name}</strong></span>
              </div>
              <CountdownTimer countdown={countdown} />
            </div>
          </div>
        );
      case "birthday-2": // Pastel Confetti
        return (
          <div className="w-full min-h-screen bg-linear-to-br from-pink-100 via-purple-50 to-indigo-100 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 text-neutral-800 dark:text-neutral-200 flex flex-col justify-center items-center p-6 relative overflow-hidden">
            <AmbientParticles animation={wish.animation} />
            <div className="max-w-lg w-full text-center space-y-6 z-10 bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-white/40 dark:border-white/10 p-8 rounded-3xl shadow-xl relative">
              <span className="text-5xl block animate-bounce">🎂</span>
              <div className="space-y-1">
                <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-indigo-600 tracking-tight">
                  {title}
                </h1>
                <p className="text-sm font-semibold text-indigo-500">{subtitle}</p>
              </div>
              <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{description}</p>
              
              {poem && (
                <div className="bg-indigo-500/5 p-4 rounded-2xl border border-indigo-500/10 italic text-sm text-indigo-600 dark:text-indigo-400">
                  {poem}
                </div>
              )}

              <div className="space-y-3 text-left">
                {messages.filter(m => m).map((msg, i) => (
                  <div key={i} className="bg-white/90 dark:bg-neutral-800/90 p-4 rounded-2xl shadow-xs border border-neutral-100 dark:border-neutral-700/50 text-sm">
                    💬 "{msg}"
                  </div>
                ))}
              </div>

              <div className="border-t border-neutral-200/50 dark:border-neutral-800 pt-4 flex justify-between items-center text-xs font-semibold">
                <span className="bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300 px-3 py-1 rounded-full">For: {recipient.name}</span>
                <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 px-3 py-1 rounded-full">By: {sender.anonymous ? "Anonymous" : sender.name}</span>
              </div>
              <CountdownTimer countdown={countdown} />
            </div>
          </div>
        );
      case "birthday-3": // Retro Arcade
        return (
          <div className="w-full min-h-screen bg-black text-green-400 p-6 font-mono relative overflow-hidden flex flex-col justify-center items-center">
            <AmbientParticles animation={wish.animation} />
            <div className="max-w-xl w-full border-2 border-purple-500 p-6 md:p-8 rounded-lg bg-neutral-950/90 shadow-[0_0_20px_purple] z-10 space-y-6">
              <div className="text-center border-b-2 border-purple-500 pb-4">
                <div className="text-xs text-purple-400 uppercase tracking-widest animate-pulse">[ INCOMING TRANSMISSION ]</div>
                <h1 className="text-2xl md:text-3xl font-black text-cyan-400 mt-2 uppercase tracking-tighter">
                  &gt; {title}
                </h1>
                <p className="text-xs text-neutral-400 mt-1">{subtitle}</p>
              </div>

              <div className="space-y-4">
                <p className="text-sm leading-relaxed text-green-300 border-l-2 border-green-500 pl-4">
                  {description}
                </p>
                <div className="bg-purple-950/20 border border-purple-500/30 p-4 rounded text-xs text-purple-300">
                  <span className="font-bold text-cyan-400">// QUEST OBJECTIVE:</span> Have an absolute blast!
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-xs text-purple-400 uppercase">// MESSAGES LOG:</span>
                {messages.filter(m => m).map((msg, i) => (
                  <div key={i} className="bg-neutral-900 border border-green-500/20 p-3 rounded text-xs">
                    <span className="text-cyan-400">[USER_{i + 1}]:</span> {msg}
                  </div>
                ))}
              </div>

              <div className="border-t border-purple-500/50 pt-4 flex justify-between items-center text-xs text-neutral-400">
                <span>RECIPIENT: <strong className="text-green-400">{recipient.name}</strong></span>
                <span>SENDER: <strong className="text-green-400">{sender.anonymous ? "ANON" : sender.name.toUpperCase()}</strong></span>
              </div>
              <CountdownTimer countdown={countdown} />
            </div>
          </div>
        );
      case "birthday-4": // Minimal Slate
        return (
          <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-6 flex flex-col justify-center items-center relative overflow-hidden">
            <AmbientParticles animation={wish.animation} />
            <div className="max-w-4xl w-full bg-white dark:bg-slate-950 rounded-3xl shadow-xl overflow-hidden grid md:grid-cols-5 z-10 border border-slate-200/50 dark:border-slate-800">
              <div className="md:col-span-2 bg-slate-900 text-white p-8 flex flex-col justify-between">
                <div className="space-y-4">
                  <span className="text-indigo-400 text-xs font-bold uppercase tracking-widest">Wishes</span>
                  <h1 className="text-3xl font-extrabold tracking-tight leading-tight">{title}</h1>
                  <p className="text-slate-400 text-xs">{subtitle}</p>
                </div>
                <div className="text-xs text-slate-400 border-t border-slate-800 pt-6">
                  <div className="mb-2">For: <strong className="text-white block text-sm">{recipient.name}</strong></div>
                  <div>From: <strong className="text-white block text-sm">{sender.anonymous ? "Anonymous" : sender.name}</strong></div>
                </div>
              </div>
              <div className="md:col-span-3 p-8 flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400 font-medium">{description}</p>
                  {quote && <blockquote className="border-l-4 border-slate-800 dark:border-slate-300 pl-4 italic text-sm text-slate-600 dark:text-slate-300">"{quote}"</blockquote>}
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Notes</h3>
                  {messages.filter(m => m).map((msg, i) => (
                    <div key={i} className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 text-sm">
                      {msg}
                    </div>
                  ))}
                </div>
                <CountdownTimer countdown={countdown} />
              </div>
            </div>
          </div>
        );
      default: // Cosmic Stardust (birthday-5 & default fallback)
        return (
          <div className="w-full min-h-screen bg-slate-950 text-white p-6 relative overflow-hidden flex flex-col justify-center items-center">
            <AmbientParticles animation={wish.animation} />
            <div className="max-w-md w-full bg-slate-900/60 backdrop-blur-md p-8 rounded-3xl border border-slate-800 shadow-2xl z-10 text-center space-y-6">
              <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Moon className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">{title}</h1>
                <p className="text-xs text-indigo-300 uppercase tracking-widest">{subtitle}</p>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{description}</p>
              
              <div className="space-y-3 text-left">
                {messages.filter(m => m).map((msg, i) => (
                  <div key={i} className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-xs leading-relaxed text-slate-300">
                    "{msg}"
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-800/80 pt-4 flex justify-between items-center text-xs text-slate-400">
                <span>To: <strong className="text-indigo-300">{recipient.name}</strong></span>
                <span>From: <strong className="text-indigo-300">{sender.anonymous ? "Anonymous" : sender.name}</strong></span>
              </div>
              <CountdownTimer countdown={countdown} />
            </div>
          </div>
        );
    }
  };

  // Render Anniversary Layouts
  const renderAnniversary = () => {
    switch (templateId) {
      case "anniversary-1": // Classic Silver
        return (
          <div className="w-full min-h-screen bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 p-6 flex flex-col justify-center items-center relative overflow-hidden font-sans">
            <AmbientParticles animation={wish.animation} />
            <div className="max-w-xl w-full bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 p-8 md:p-12 rounded-3xl shadow-lg text-center space-y-8 z-10">
              <div className="text-neutral-400 text-xs font-bold uppercase tracking-wider">// Celebrating Love</div>
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{title}</h1>
                <p className="text-sm text-neutral-500 font-serif italic">{subtitle}</p>
              </div>
              <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-sm">{description}</p>
              {quote && <div className="text-sm font-semibold italic text-neutral-500">"{quote}"</div>}
              
              <div className="space-y-3 text-left">
                {messages.filter(m => m).map((msg, i) => (
                  <div key={i} className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800/60 text-sm">
                    {msg}
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center text-xs font-bold text-neutral-400 border-t border-neutral-200 dark:border-neutral-800 pt-6">
                <span>Couple: {recipient.name}</span>
                <span>Send By: {sender.anonymous ? "Anonymous" : sender.name}</span>
              </div>
              <CountdownTimer countdown={countdown} />
            </div>
          </div>
        );
      case "anniversary-2": // Ruby Romance
        return (
          <div className="w-full min-h-screen bg-gradient-to-tr from-rose-900 via-red-950 to-neutral-950 text-white p-6 flex flex-col justify-center items-center relative overflow-hidden font-serif">
            <AmbientParticles animation={wish.animation} />
            <div className="max-w-md w-full bg-red-950/30 backdrop-blur-md border border-rose-500/20 p-8 rounded-full aspect-square flex flex-col justify-center items-center text-center space-y-4 z-10 shadow-2xl relative">
              <Heart className="w-12 h-12 text-rose-500 fill-rose-500 animate-pulse" />
              <h1 className="text-2xl md:text-3xl font-black text-rose-200 leading-tight">{title}</h1>
              <p className="text-xs text-rose-300 font-sans tracking-widest uppercase">{subtitle}</p>
              <p className="text-xs text-neutral-300 max-w-[280px] leading-relaxed font-sans">{description}</p>
              <div className="text-[10px] text-rose-400 font-sans mt-2">
                With Love to: <strong>{recipient.name}</strong> <br />
                From: <strong>{sender.anonymous ? "Anonymous" : sender.name}</strong>
              </div>
            </div>
            {/* Display message cards in a separate row below */}
            <div className="max-w-md w-full mt-6 space-y-3 z-10 font-sans">
              {messages.filter(m => m).map((msg, i) => (
                <div key={i} className="bg-neutral-950/80 p-4 rounded-2xl border border-rose-500/10 text-xs text-neutral-300">
                  "{msg}"
                </div>
              ))}
            </div>
            <CountdownTimer countdown={countdown} />
          </div>
        );
      default: // Falling back to default styles or modern blurs for remaining anniversary template categories
        return (
          <div className="w-full min-h-screen bg-linear-to-br from-neutral-900 to-indigo-950 text-white p-6 flex flex-col justify-center items-center relative overflow-hidden font-sans">
            <AmbientParticles animation={wish.animation} />
            <div className="max-w-lg w-full bg-white/5 dark:bg-black/35 backdrop-blur-xl border border-white/10 p-8 rounded-3xl z-10 shadow-2xl space-y-6">
              <div className="flex justify-between items-center">
                <span className="bg-primary/20 text-primary-foreground text-xs px-3 py-1 rounded-full font-bold">♥ Anniversary Wish</span>
                <Clock className="w-4 h-4 text-neutral-400" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
              <p className="text-indigo-200 text-sm font-semibold">{subtitle}</p>
              <p className="text-slate-300 text-sm leading-relaxed">{description}</p>

              <div className="grid gap-3 mt-4">
                {messages.filter(m => m).map((msg, i) => (
                  <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5 text-xs text-slate-300">
                    "{msg}"
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-4 flex justify-between items-center text-xs text-neutral-400">
                <span>Dear: <strong className="text-white">{recipient.name}</strong></span>
                <span>Send By: <strong className="text-white">{sender.anonymous ? "Anonymous" : sender.name}</strong></span>
              </div>
              <CountdownTimer countdown={countdown} />
            </div>
          </div>
        );
    }
  };

  // Render Wedding Layouts
  const renderWedding = () => {
    return (
      <div className="w-full min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-100 p-6 flex flex-col justify-center items-center relative overflow-hidden font-serif">
        <AmbientParticles animation={wish.animation} />
        <div className="max-w-2xl w-full bg-white dark:bg-neutral-900 border-2 border-double border-neutral-300 dark:border-neutral-800 p-8 md:p-12 rounded-3xl shadow-xl text-center space-y-8 z-10">
          <div className="text-3xl">💍</div>
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide">{title}</h1>
            <p className="text-sm font-sans tracking-widest text-neutral-500 uppercase">{subtitle}</p>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans max-w-lg mx-auto">{description}</p>
          
          <div className="grid gap-4 font-sans text-left text-sm max-w-md mx-auto">
            <h3 className="font-bold text-xs uppercase text-neutral-400 tracking-wider">Congratulations from Guestbook:</h3>
            {messages.filter(m => m).map((msg, i) => (
              <div key={i} className="bg-neutral-50 dark:bg-neutral-950 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800/80">
                "{msg}"
              </div>
            ))}
          </div>

          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6 flex justify-between items-center text-xs font-sans text-neutral-400 max-w-md mx-auto">
            <span>To: <strong className="text-neutral-800 dark:text-neutral-200">{recipient.name}</strong></span>
            <span>Sender: <strong className="text-neutral-800 dark:text-neutral-200">{sender.anonymous ? "Anonymous" : sender.name}</strong></span>
          </div>
          <CountdownTimer countdown={countdown} />
        </div>
      </div>
    );
  };

  // Render Valentine Layouts
  const renderValentine = () => {
    return (
      <div className="w-full min-h-screen bg-rose-950 text-white p-6 flex flex-col justify-center items-center relative overflow-hidden font-sans">
        <AmbientParticles animation={wish.animation} />
        <div className="max-w-md w-full bg-linear-to-b from-rose-900 to-rose-950 border border-rose-500/20 p-8 rounded-3xl shadow-2xl text-center space-y-6 z-10">
          <Heart className="w-12 h-12 text-rose-500 fill-rose-500 animate-pulse mx-auto" />
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-rose-200">{title}</h1>
            <p className="text-xs text-rose-400 font-semibold uppercase tracking-widest">{subtitle}</p>
          </div>
          <p className="text-sm text-neutral-300 leading-relaxed">{description}</p>

          <div className="space-y-3 text-left">
            {messages.filter(m => m).map((msg, i) => (
              <div key={i} className="bg-rose-900/40 p-4 rounded-2xl border border-rose-500/10 text-xs text-neutral-300">
                "{msg}"
              </div>
            ))}
          </div>

          <div className="border-t border-rose-900 pt-4 flex justify-between items-center text-xs text-rose-300">
            <span>Dear: <strong>{recipient.name}</strong></span>
            <span>From: <strong>{sender.anonymous ? "Anonymous" : sender.name}</strong></span>
          </div>
          <CountdownTimer countdown={countdown} />
        </div>
      </div>
    );
  };

  // Render Other Event Layouts
  const renderOther = () => {
    const isGraduation = wish.occasion === "graduation" || templateId === "other-1";
    const isNewYear = wish.occasion === "new-year" || templateId === "other-2";
    const isChristmas = wish.occasion === "christmas" || templateId === "other-3";

    return (
      <div className={cn("w-full min-h-screen text-white p-6 flex flex-col justify-center items-center relative overflow-hidden font-sans", 
        isGraduation ? "bg-emerald-950 text-emerald-100" :
        isNewYear ? "bg-black text-yellow-100" :
        isChristmas ? "bg-neutral-900 text-red-100" : "bg-neutral-900"
      )}>
        <AmbientParticles animation={wish.animation} />
        <div className={cn("max-w-xl w-full border backdrop-blur-md p-8 md:p-10 rounded-3xl shadow-2xl z-10 text-center space-y-6",
          isGraduation ? "bg-emerald-900/35 border-emerald-500/20" :
          isNewYear ? "bg-neutral-950/80 border-yellow-500/20" :
          isChristmas ? "bg-neutral-950/80 border-red-500/20" : "bg-white/5 border-white/10"
        )}>
          {isGraduation && <GraduationCap className="w-12 h-12 text-emerald-400 mx-auto" />}
          {isNewYear && <Sparkles className="w-12 h-12 text-yellow-400 mx-auto animate-pulse" />}
          {isChristmas && <TreePine className="w-12 h-12 text-green-400 mx-auto" />}

          <div className="space-y-1">
            <h1 className={cn("text-3xl md:text-4xl font-black",
              isGraduation ? "text-emerald-300" :
              isNewYear ? "text-yellow-400" :
              isChristmas ? "text-red-400" : "text-white"
            )}>{title}</h1>
            <p className="text-xs uppercase tracking-widest text-neutral-400">{subtitle}</p>
          </div>

          <p className="text-sm text-neutral-300 leading-relaxed max-w-md mx-auto">{description}</p>

          <div className="space-y-3 text-left max-w-md mx-auto">
            {messages.filter(m => m).map((msg, i) => (
              <div key={i} className="bg-black/20 p-4 rounded-xl border border-white/5 text-xs text-neutral-300">
                "{msg}"
              </div>
            ))}
          </div>

          <div className="border-t border-white/5 pt-4 flex justify-between items-center text-xs text-neutral-400 max-w-md mx-auto">
            <span>To: <strong className="text-white">{recipient.name}</strong></span>
            <span>From: <strong className="text-white">{sender.anonymous ? "Anonymous" : sender.name}</strong></span>
          </div>
          <CountdownTimer countdown={countdown} />
        </div>
      </div>
    );
  };

  // Occasion routing switcher
  const renderContent = () => {
    switch (wish.occasion) {
      case "birthday":
        return renderBirthday();
      case "anniversary":
        return renderAnniversary();
      case "wedding":
        return renderWedding();
      case "valentine":
        return renderValentine();
      default:
        return renderOther();
    }
  };

  return (
    <>
      <AnimationStyles />
      {renderContent()}
    </>
  );
};

export default WishTemplateRenderer;

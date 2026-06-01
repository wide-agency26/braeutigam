"use client";

import React from "react";

interface NotchedCardProps {
  children: React.ReactNode;
  notchPosition?: "bottom-left" | "bottom-right";
  className?: string;
  isDark?: boolean;
  active?: boolean;
  noPadding?: boolean;
}

export default function NotchedCard({
  children,
  notchPosition = "bottom-left",
  className = "",
  isDark = true,
  active = true,
  noPadding = false
}: NotchedCardProps) {
  // Define clip path polygon styles
  const clipPathStyle = notchPosition === "bottom-left"
    ? "polygon(0 0, 100% 0, 100% 100%, 36px 100%, 20px calc(100% - 16px), 0 calc(100% - 16px))"
    : "polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 36px) calc(100% - 16px), calc(100% - 20px) 100%, 0 100%)";

  // In dark mode: border is neon green when active, dark grey when inactive.
  // In light mode: border is dark grey when active, light grey when inactive.
  const outerBg = isDark 
    ? (active ? "bg-brand-neon" : "bg-zinc-800/80 hover:bg-zinc-700/80") 
    : (active ? "bg-zinc-800" : "bg-zinc-250 hover:bg-zinc-300");
    
  const innerBg = isDark
    ? "bg-[#0B0B0C]"
    : "bg-white";

  return (
    <div 
      className={`relative p-[1px] transition-colors duration-500 ${className}`}
      style={{ clipPath: clipPathStyle }}
    >
      {/* Outer border shape */}
      <div 
        className={`absolute inset-0 transition-colors duration-500 ${outerBg}`}
        style={{ clipPath: clipPathStyle, pointerEvents: "none" }}
      />
      {/* Inner background shape */}
      <div 
        className={`relative w-full h-full transition-colors duration-500 ${innerBg} ${noPadding ? "p-0" : "p-6"}`}
        style={{ clipPath: clipPathStyle }}
      >
        {children}
      </div>
    </div>
  );
}

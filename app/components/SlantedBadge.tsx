"use client";

import React from "react";

interface SlantedBadgeProps {
  children: React.ReactNode;
  className?: string;
  isDark?: boolean;
}

export default function SlantedBadge({
  children,
  className = "",
  isDark = true
}: SlantedBadgeProps) {
  // Symmetric trapezoid clip path
  const clipPathStyle = "polygon(10px 0, calc(100% - 10px) 0, 100% 100%, 0 100%)";

  const borderColor = isDark ? "bg-brand-neon" : "bg-zinc-400";
  const bgColor = isDark ? "bg-brand-dark/60" : "bg-zinc-150/70";
  const textColor = isDark ? "text-brand-neon" : "text-zinc-800";

  return (
    <div 
      className={`relative p-[1px] font-mono text-[9px] font-bold tracking-widest uppercase select-none ${className}`}
      style={{ clipPath: clipPathStyle }}
    >
      {/* Border Outline */}
      <div 
        className={`absolute inset-0 ${borderColor}`}
        style={{ clipPath: clipPathStyle, pointerEvents: "none" }}
      />
      {/* Content Area */}
      <div 
        className={`relative px-4 py-1.5 transition-colors duration-500 ${bgColor} ${textColor}`}
        style={{ clipPath: clipPathStyle }}
      >
        {children}
      </div>
    </div>
  );
}

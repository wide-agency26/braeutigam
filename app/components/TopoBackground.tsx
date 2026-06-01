import React from 'react';

interface TopoBackgroundProps {
  className?: string;
  opacityClass?: string;
}

export default function TopoBackground({ className = "", opacityClass = "opacity-[0.065]" }: TopoBackgroundProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <svg
        className={`w-full h-full text-zinc-600 dark:text-zinc-400 ${opacityClass}`}
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Topographic contour lines */}
        <path d="M-100 150 C 200 120, 400 300, 600 250 S 900 100, 1100 180 S 1300 450, 1600 400" stroke="currentColor" strokeWidth="1.2" />
        <path d="M-100 230 C 220 190, 420 380, 630 330 S 920 180, 1130 260 S 1320 530, 1600 480" stroke="currentColor" strokeWidth="1.2" />
        <path d="M-100 310 C 240 260, 440 460, 660 410 S 940 260, 1160 340 S 1340 610, 1600 560" stroke="currentColor" strokeWidth="1.2" />
        <path d="M-100 390 C 260 330, 460 540, 690 490 S 960 340, 1190 420 S 1360 690, 1600 640" stroke="currentColor" strokeWidth="1.2" />
        <path d="M-100 470 C 280 400, 480 620, 720 570 S 980 420, 1220 500 S 1380 770, 1600 720" stroke="currentColor" strokeWidth="1.2" />
        <path d="M-100 550 C 300 470, 500 700, 750 650 S 1000 500, 1250 580 S 1400 850, 1600 800" stroke="currentColor" strokeWidth="1.2" />
        <path d="M-100 630 C 320 540, 520 780, 780 730 S 1020 580, 1280 660 S 1420 930, 1600 880" stroke="currentColor" strokeWidth="1.2" />
        
        {/* Additional organic concentric curves in top right */}
        <path d="M 800 -100 C 950 50, 1200 100, 1350 50 S 1500 -50, 1600 -100" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
        <path d="M 850 -100 C 990 80, 1230 130, 1380 80 S 1520 -30, 1600 -80" stroke="currentColor" strokeWidth="1" />
        <path d="M 900 -100 C 1030 110, 1260 160, 1410 110 S 1540 -10, 1600 -60" stroke="currentColor" strokeWidth="1" />
        <path d="M 950 -100 C 1070 140, 1290 190, 1440 140 S 1560 10, 1600 -40" stroke="currentColor" strokeWidth="1" />
        
        {/* Additional curves in bottom left */}
        <path d="M-100 600 C 100 650, 200 800, 150 950 S-50 1100, -100 1100" stroke="currentColor" strokeWidth="1" />
        <path d="M-100 680 C 120 730, 220 880, 170 1030 S-30 1180, -100 1180" stroke="currentColor" strokeWidth="1" />
        <path d="M-100 760 C 140 810, 240 960, 190 1110 S-10 1260, -100 1260" stroke="currentColor" strokeWidth="1" />
      </svg>
    </div>
  );
}

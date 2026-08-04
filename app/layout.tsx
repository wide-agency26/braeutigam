import type { Metadata } from "next";
import localFont from "next/font/local";
import { Mr_Dafoe, JetBrains_Mono } from "next/font/google";
import "./globals.css";

/* ── Font 1: Univers LT Std — replaces Oswald (body/sans) ──
   Only the weights the design actually requests (100/300/400/700) are
   declared; 200 and 900 could never be selected by the CSS weight-matching
   algorithm given these faces. */
const universLTStd = localFont({
  src: [
    { path: "./fonts/UniversLTStd-ThinUltraCn.woff2", weight: "100", style: "normal" },
    { path: "./fonts/UniversLTStd-Light.woff2", weight: "300", style: "normal" },
    { path: "./fonts/UniversLTStd.woff2", weight: "400", style: "normal" },
    { path: "./fonts/UniversLTStd-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-univers",
  display: "swap",
});

/* ── Font 2: DxBurst-Smooth — display/heading font ──
   Below the fold only, so it must not compete with the LCP image for
   bandwidth. */
const dxBurstSmooth = localFont({
  src: "./fonts/DxBurst-Smooth.woff2",
  weight: "400",
  variable: "--font-dxburst",
  display: "swap",
  preload: false,
});

/* ── Font 2.5: DxBurst-Regular — bold display font (menu overlay only) ── */
const dxBurstRegular = localFont({
  src: "./fonts/DxBurst-Regular.woff2",
  weight: "400",
  variable: "--font-dxburst-bold",
  display: "swap",
  preload: false,
});

/* ── Font 3: Mr Dafoe — placeholder for Prime (cursive) ── */
const mrDafoe = Mr_Dafoe({
  weight: "400",
  variable: "--font-mr-dafoe",
  subsets: ["latin"],
});

/* ── Font 4: JetBrains Mono — mono/tech labels ──
   Only the weights the UI requests (regular labels + bold/semibold HUD). */
const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "600", "700"],
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  preload: false,
});

export const metadata: Metadata = {
  title: "Bräutigam GmbH | Premium Motorsport Carbon Fiber",
  description: "State-of-the-art carbon fiber engineering and autoclave curing for peak motorsport performance. Precision CAD-to-Carbon execution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // `dark` is the default theme — set on <html> so first paint matches and
    // Tailwind `dark:` utilities work before the client ThemeProvider hydrates.
    <html
      lang="en"
      suppressHydrationWarning
      className={`dark ${universLTStd.variable} ${dxBurstSmooth.variable} ${dxBurstRegular.variable} ${mrDafoe.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body className="min-h-screen overflow-x-hidden bg-[var(--background)] text-[var(--foreground)]">
        {children}
      </body>
    </html>
  );
}

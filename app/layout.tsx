import type { Metadata } from "next";
import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "./components/ThemeProvider";
import { siteIndexable } from "@/lib/site-config";
import "./globals.css";

/* Univers LT Std 55 Roman */
const universLTStd = localFont({
  src: "./fonts/UniversLTStd.woff2",
  weight: "400",
  variable: "--font-univers",
  display: "swap",
});

/* Univers LT Std 67 Bold Condensed (OTF — no web license file in repo; flagged in PR) */
const universBoldCn = localFont({
  src: "./fonts/UniversLTStd-BoldCn.otf",
  weight: "700",
  variable: "--font-univers-bold-cn",
  display: "swap",
});

/* Univers LT Std 57 Condensed (OTF — flagged) */
const universCn = localFont({
  src: "./fonts/UniversLTStd-Cn.otf",
  weight: "400",
  variable: "--font-univers-cn",
  display: "swap",
});

const bootzy = localFont({
  src: "./fonts/BootzyTM.woff2",
  weight: "400",
  variable: "--font-bootzy",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["300", "400"],
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  preload: false,
});

export const metadata: Metadata = {
  title: "Bräutigam GmbH | Premium Motorsport Carbon Fiber",
  description:
    "State-of-the-art carbon fiber engineering and autoclave curing for peak motorsport performance. Precision CAD-to-Carbon execution.",
  ...(siteIndexable() ? {} : { robots: { index: false, follow: false } }),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      suppressHydrationWarning
      className={`dark ${universLTStd.variable} ${universBoldCn.variable} ${universCn.variable} ${bootzy.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <head>
        <link rel="stylesheet" href="/typography-tokens.css" />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('braeutigam-theme');if(t==='light'){document.documentElement.classList.remove('dark');document.documentElement.classList.add('light');document.documentElement.style.colorScheme='light'}}catch(e){}",
          }}
        />
      </head>
      <body className="min-h-screen overflow-x-hidden bg-[var(--background)] text-[var(--foreground)]">
        <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
      </body>
    </html>
  );
}

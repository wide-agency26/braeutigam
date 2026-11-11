"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  persistLocaleCookie,
  switchLocalePath,
  type Locale,
} from "@/lib/i18n";
import { useSiteLocale } from "@/lib/i18n/use-locale";

const shellClass =
  "h-12 rounded-xl flex items-center justify-center gap-2 px-3 copy-caption transition-all duration-300 border-none backdrop-blur-sm bg-zinc-900/90 text-zinc-100 dark:bg-zinc-100/90 dark:text-zinc-900";

function LangLink({
  label,
  target,
  pathname,
  active,
}: {
  label: string;
  target: Locale;
  pathname: string;
  active: boolean;
}) {
  const href = switchLocalePath(pathname, target);
  return (
    <Link
      href={href}
      hrefLang={target}
      className={`min-w-[2rem] text-center ${active ? "text-brand-neon dark:text-brand-neon" : "opacity-70 hover:opacity-100"}`}
      aria-current={active ? "true" : undefined}
      onClick={() => persistLocaleCookie(target)}
    >
      {label}
    </Link>
  );
}

export default function LanguageSwitch() {
  const pathname = usePathname() ?? "/";
  const current = useSiteLocale();

  return (
    <MotionSafeShell>
      <LangLink label="DE" target="de" pathname={pathname} active={current === "de"} />
      <span className="opacity-40" aria-hidden>
        |
      </span>
      <LangLink label="EN" target="en" pathname={pathname} active={current === "en"} />
    </MotionSafeShell>
  );
}

function MotionSafeShell({ children }: { children: ReactNode }) {
  return <div className={shellClass}>{children}</div>;
}

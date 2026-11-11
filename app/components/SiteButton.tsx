"use client";

import { useMemo } from "react";
import type { MouseEventHandler, ReactNode } from "react";
import SpecularButton from "./SpecularButton";
import { readCssVarColor } from "@/lib/css-var-color";

type Variant = "default" | "solid" | "amber" | "fill";

function useSpecularLook(variant: Variant) {
  return useMemo(() => {
    const ink = readCssVarColor("--surface-pages-page-secondary", "#1f2020");
    const hover = readCssVarColor("--button-background-default-hover", "#424343");
    const btnText = readCssVarColor("--button-text-default", "#f3f3f3");
    const btnHoverText = readCssVarColor("--button-text-default-hover", "#00cc00");
    const neon = readCssVarColor("--colors-greeeen", "#00ff00");
    const subtle = readCssVarColor("--text-default-accent-subtle", "#00cc00");
    const heading = readCssVarColor("--text-default-heading", "#131414");
    const amber = readCssVarColor("--text-default-accent-secondary", "#ff8800");
    const map: Record<Variant, { tint: string; textColor: string; lineColor: string; baseColor: string }> = {
      default: { tint: ink, textColor: btnText, lineColor: neon, baseColor: hover },
      solid: { tint: hover, textColor: btnHoverText, lineColor: btnHoverText, baseColor: btnHoverText },
      amber: { tint: ink, textColor: btnText, lineColor: amber, baseColor: amber },
      fill: { tint: subtle, textColor: heading, lineColor: neon, baseColor: subtle },
    };
    return map[variant];
  }, [variant]);
}

type SiteButtonProps = {
  href?: string;
  variant?: Variant;
  size?: "sm" | "lg";
  className?: string;
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  target?: string;
  rel?: string;
};

export default function SiteButton({
  href,
  variant = "default",
  size = "lg",
  className = "",
  children,
  ...rest
}: SiteButtonProps) {
  const look = useSpecularLook(variant);
  const typeClass = size === "sm" ? "button-body-caption" : "button-body-lg";
  const classes = [
    "site-btn",
    typeClass,
    size === "sm" ? "site-btn--sm" : "",
    variant === "solid" ? "site-btn--solid" : "",
    variant === "amber" ? "site-btn--amber" : "",
    variant === "fill" ? "site-btn--fill" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <SpecularButton
      href={href}
      size={size === "sm" ? "sm" : "lg"}
      radius={size === "sm" ? 8 : 12}
      tint={look.tint}
      tintOpacity={1}
      blur={0}
      textColor={look.textColor}
      lineColor={look.lineColor}
      baseColor={look.baseColor}
      intensity={1}
      idleIntensity={0.35}
      shineSize={10}
      shineFade={34}
      thickness={size === "sm" ? 1 : 1.2}
      glow={1}
      followMouse
      proximity={250}
      className={classes}
      {...rest}
    >
      {children}
    </SpecularButton>
  );
}

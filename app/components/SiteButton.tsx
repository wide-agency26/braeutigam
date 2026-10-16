"use client";

import type { MouseEventHandler, ReactNode } from "react";
import SpecularButton from "./SpecularButton";

type Variant = "default" | "solid" | "amber" | "fill";

const LOOK: Record<Variant, { tint: string; textColor: string; lineColor: string; baseColor: string }> = {
  default: { tint: "#1f2020", textColor: "#f3f3f3", lineColor: "#00ff00", baseColor: "#525252" },
  solid: { tint: "#424343", textColor: "#00cc00", lineColor: "#00cc00", baseColor: "#00cc00" },
  amber: { tint: "#1f2020", textColor: "#f3f3f3", lineColor: "#ffbf00", baseColor: "#ffbf00" },
  fill: { tint: "#00cc00", textColor: "#131414", lineColor: "#00ff00", baseColor: "#00cc00" },
};

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
  const look = LOOK[variant];
  const classes = [
    "site-btn",
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

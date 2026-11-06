"use client";

import type { Expert } from "@/lib/data/experts";
import LazyOnVisible from "./LazyOnVisible";

const loadExpertCard = () => import("./ExpertCard");

export default function ExpertSlot({
  expert,
  delay,
  headingLevel,
}: {
  expert: Expert;
  delay?: string;
  headingLevel?: 2 | 3;
}) {
  return (
    <LazyOnVisible
      loader={loadExpertCard}
      rootMargin="100px"
      className="experts-figma__card"
      style={{ width: "100%", aspectRatio: "403 / 522", transitionDelay: delay }}
      componentProps={{ ...expert, headingLevel }}
    />
  );
}

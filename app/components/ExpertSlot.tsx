"use client";

import type { Expert } from "@/lib/data/experts";
import ExpertCard from "./ExpertCard";

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
    <div
      className="experts-figma__card"
      style={{ width: "100%", aspectRatio: "403 / 522", transitionDelay: delay }}
    >
      {/* Content is available in the first HTML response; portraits stay lazy. */}
      <ExpertCard {...expert} headingLevel={headingLevel} />
    </div>
  );
}

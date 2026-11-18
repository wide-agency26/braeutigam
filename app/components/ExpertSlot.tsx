"use client";

import type { Expert } from "@/lib/data/experts";
import ExpertCard from "./ExpertCard";

export default function ExpertSlot({
  expert,
  delay,
  headingLevel,
  eager,
}: {
  expert: Expert;
  delay?: string;
  headingLevel?: 2 | 3;
  eager?: boolean;
}) {
  return (
    <div className="experts-figma__card" style={{ width: "100%", transitionDelay: delay }}>
      <ExpertCard {...expert} headingLevel={headingLevel} eager={eager} />
    </div>
  );
}

"use client";

import "./CompositeSpecCard.css";

type SpecRow = { label: string; value: string; labelId: string; valueId: string };

const LATE_ROWS: SpecRow[] = [
  { label: "PART:", value: "VEHICLE_BR_CHASSIS", labelId: "2006:341", valueId: "2006:342" },
  { label: "WEAVE:", value: "2X2 TWILL PREPREG", labelId: "2006:343", valueId: "2006:344" },
  { label: "VOIDS:", value: "< 0.05 %", labelId: "2006:345", valueId: "2006:346" },
  { label: "TOLERANCE", value: "< 0.05 MM", labelId: "2006:347", valueId: "2006:348" },
];

export default function CompositeSpecCard({
  badge = "[QC CERTIFIED]",
  badgeNodeId = "2006:338",
}: {
  badge?: string;
  badgeNodeId?: string;
}) {
  return (
    <div className="composite-spec" data-figma-node="2006:334" data-figma-node-dark="1334:1527">
      <div className="composite-spec__panel" data-figma-node="2006:352">
        <header className="composite-spec__head copy-caption" data-figma-node="2006:336">
          <span className="composite-spec__head-label" data-figma-node="2006:337">
            {"// COMPOSITE_SPEC"}
          </span>
          <span className="composite-spec__badge" data-figma-node={badgeNodeId}>
            {badge}
          </span>
        </header>
        <div className="composite-spec__rows" data-figma-node="2006:339">
          {LATE_ROWS.map((row) => (
            <div key={row.label} className="composite-spec__row copy-caption">
              <span className="composite-spec__label" data-figma-node={row.labelId}>
                {row.label}
              </span>
              <span className="composite-spec__value" data-figma-node={row.valueId}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

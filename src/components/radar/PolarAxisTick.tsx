
import { Concept } from "@/types/concept";
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface PolarAxisTickProps {
  x?: number;
  y?: number;
  payload?: any;
  textAnchor?: string;
  concepts: Concept[];
  highlighted: string | null;
  chartData: any[];
}

export const PolarAxisTick = (props: PolarAxisTickProps) => {
  const { x = 0, y = 0, payload, textAnchor } = props;
  const isMobile = useIsMobile();
  
  if (!payload) return null;
  
  // Calculate alignment based on position
  let alignment = textAnchor || "middle";
  let xOffset = 0;
  let yOffset = 0;
  
  // Determine positioning based on angle
  const centerX = 175; // Approximate center X of chart
  const centerY = 175; // Approximate center Y of chart
  const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);
  
  // Adjust positioning based on angle with increased distances
  if (angle > -45 && angle < 45) { // Right side
    alignment = "start";
    xOffset = isMobile ? 8 : 16;
  } else if (angle > 45 && angle < 135) { // Bottom side
    alignment = "middle";
    yOffset = isMobile ? 12 : 20;
  } else if ((angle > 135 && angle <= 180) || (angle >= -180 && angle < -135)) { // Left side
    alignment = "end";
    xOffset = isMobile ? -8 : -16;
  } else { // Top side
    alignment = "middle";
    yOffset = isMobile ? -12 : -20;
  }
  
  // Simple label display, no metrics
  return (
    <g transform={`translate(${x + xOffset},${y + yOffset})`}>
      <text
        x={0}
        y={0}
        textAnchor={alignment}
        fill="#1E293B"
        fontSize={isMobile ? 13 : 15}
        fontWeight={600}
        className="uppercase"
      >
        {payload.value}
      </text>
    </g>
  );
};

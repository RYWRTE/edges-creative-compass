
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
  const { x = 0, y = 0, payload, textAnchor, concepts, highlighted, chartData } = props;
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
  
  // Adjust positioning based on angle
  if (angle > -45 && angle < 45) { // Right side
    alignment = "start";
    xOffset = isMobile ? 5 : 12;
  } else if (angle > 45 && angle < 135) { // Bottom side
    alignment = "middle";
    yOffset = isMobile ? 8 : 15;
  } else if ((angle > 135 && angle <= 180) || (angle >= -180 && angle < -135)) { // Left side
    alignment = "end";
    xOffset = isMobile ? -5 : -12;
  } else { // Top side
    alignment = "middle";
    yOffset = isMobile ? -8 : -15;
  }
  
  // On mobile, display just the main label and simple value
  if (isMobile) {
    return (
      <g transform={`translate(${x + xOffset},${y + yOffset})`}>
        <text
          x={0}
          y={0}
          textAnchor={alignment}
          fill="#1E293B"
          fontSize={12}
          fontWeight={600}
        >
          {payload.value}
        </text>
        
        {/* Only show value for highlighted concept on mobile */}
        {highlighted && concepts.length > 0 ? (
          <text
            x={0}
            y={18}
            textAnchor={alignment}
            fill={concepts.find(c => c.name === highlighted)?.color || "#64748B"}
            fontSize={11}
            fontWeight={600}
          >
            {chartData.find(item => item.criterion === payload.value)?.[highlighted] || 0}
          </text>
        ) : null}
      </g>
    );
  }
  
  // Desktop view with more details
  return (
    <g transform={`translate(${x + xOffset},${y + yOffset})`}>
      <text
        x={0}
        y={0}
        textAnchor={alignment}
        fill="#1E293B"
        fontSize={14}
        fontWeight={600}
        className="uppercase"
      >
        {payload.value}
      </text>
      
      {/* If we're not highlighting anything, show average values */}
      {concepts.length > 0 && !highlighted ? (
        <text
          x={0}
          y={22}
          textAnchor={alignment}
          fill="#64748B"
          fontSize={12}
        >
          Average: {(concepts.reduce((sum, concept) => {
            const criterionName = Object.keys(chartData[0]).find(key => 
              key !== 'criterion' && !key.includes('_value') && 
              chartData.find(item => item.criterion === payload.value)?.[key] !== undefined
            );
            return sum + (chartData.find(item => item.criterion === payload.value)?.[criterionName || ''] || 0);
          }, 0) / concepts.length).toFixed(1)}
        </text>
      ) : null}
      
      {/* If we're showing all concepts or just one highlighted one */}
      {concepts.length > 0 ? (
        <g>
          {concepts.map((concept, index) => {
            if (highlighted && highlighted !== concept.name) return null;
            
            const value = chartData.find(item => item.criterion === payload.value)?.[`${concept.name}_value`] || 0;
            return (
              <text
                key={index}
                x={0}
                y={highlighted ? 22 : (42 + (index * 20))}
                textAnchor={alignment}
                fill={concept.color || "#4B5563"}
                fontSize={highlighted ? 13 : 12}
                fontWeight={highlighted === concept.name ? 700 : 500}
              >
                {concept.name}: {value}
              </text>
            );
          })}
        </g>
      ) : null}
    </g>
  );
};

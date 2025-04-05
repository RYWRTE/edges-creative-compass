
import { Concept } from "@/types/concept";
import React from "react";

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
  
  if (!payload) return null;
  
  // Check if the axis is on the far sides
  const isSideAxis = x && Math.abs(x - 250) > 200;
  
  // Calculate alignment based on position - helps with spacing text properly
  let alignment = textAnchor || "middle";
  let xOffset = 0;
  
  if (isSideAxis) {
    // Give more space for side labels
    xOffset = x < 250 ? -25 : 25;
    alignment = x < 250 ? "end" : "start";
  }
  
  return (
    <g transform={`translate(${x + xOffset},${y})`}>
      <text
        x={0}
        y={0}
        textAnchor={alignment}
        fill="#1E293B" // Darker text for better contrast
        fontSize={15}
        fontWeight={700}
        className="uppercase"
      >
        {payload.value}
      </text>
      
      {/* If we're not highlighting anything, show average values */}
      {concepts.length > 0 && !highlighted ? (
        <text
          x={0}
          y={28}
          textAnchor={alignment}
          fill="#64748B"
          fontSize={13}
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
                y={highlighted ? 28 : (56 + (index * 28))} // Increased vertical spacing
                textAnchor={alignment}
                fill={concept.color || "#4B5563"}
                fontSize={highlighted ? 14 : 13}
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


import { Concept } from "@/types/concept";

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
  
  // Adjust the threshold for side axis detection
  const isSideAxis = x && Math.abs(x - 250) > 180;
  
  // Calculate alignment based on position
  let alignment = textAnchor || "middle";
  let xOffset = 0;
  let yOffset = 0;
  
  if (isSideAxis) {
    // Increase offset for side labels
    xOffset = x < 250 ? -28 : 28;
    alignment = x < 250 ? "end" : "start";
  }
  
  // Add more vertical offset for top/bottom labels
  if (y < 150) {
    yOffset = -10; // Move top labels up
  } else if (y > 350) {
    yOffset = 10; // Move bottom labels down
  }
  
  // Calculate the base spacing and multiplier for concept values
  const baseSpacing = 28; // Increased from 24
  const spacingMultiplier = 30; // Increased from 24
  
  return (
    <g transform={`translate(${x + xOffset},${y + yOffset})`}>
      <text
        x={0}
        y={0}
        textAnchor={alignment}
        fill="#1E293B"
        fontSize={15} // Slightly larger
        fontWeight={700}
        className="uppercase"
      >
        {payload.value}
      </text>
      
      {/* Average values */}
      {concepts.length > 0 && !highlighted ? (
        <text
          x={0}
          y={baseSpacing}
          textAnchor={alignment}
          fill="#64748B"
          fontSize={13} // Slightly larger
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
      
      {/* Individual concept values with increased spacing */}
      {concepts.length > 0 ? (
        <g>
          {concepts.map((concept, index) => {
            if (highlighted && highlighted !== concept.name) return null;
            
            const value = chartData.find(item => item.criterion === payload.value)?.[`${concept.name}_value`] || 0;
            return (
              <text
                key={index}
                x={0}
                y={highlighted ? baseSpacing : (baseSpacing + (index * spacingMultiplier))}
                textAnchor={alignment}
                fill={concept.color || "#4B5563"}
                fontSize={highlighted ? 14 : 13} // Increased font size
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

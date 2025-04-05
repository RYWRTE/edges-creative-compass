
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
  
  const isSideAxis = x && Math.abs(x - 250) > 200;
  
  // Calculate alignment based on position
  let alignment = textAnchor || "middle";
  let xOffset = 0;
  
  if (isSideAxis) {
    xOffset = x < 250 ? -20 : 20;
    alignment = x < 250 ? "end" : "start";
  }
  
  return (
    <g transform={`translate(${x + xOffset},${y})`}>
      <text
        x={0}
        y={0}
        textAnchor={alignment}
        fill="#1E293B"
        fontSize={14}
        fontWeight={700}
        className="uppercase"
      >
        {payload.value}
      </text>
      
      {/* Average values */}
      {concepts.length > 0 && !highlighted ? (
        <text
          x={0}
          y={24}
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
      
      {/* Individual concept values */}
      {concepts.length > 0 ? (
        <g>
          {concepts.map((concept, index) => {
            if (highlighted && highlighted !== concept.name) return null;
            
            const value = chartData.find(item => item.criterion === payload.value)?.[`${concept.name}_value`] || 0;
            return (
              <text
                key={index}
                x={0}
                y={highlighted ? 24 : (48 + (index * 24))}
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

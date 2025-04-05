
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Concept } from "@/types/concept";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { RadarTooltip } from "./RadarTooltip";
import { PolarAxisTick } from "./PolarAxisTick";
import { useIsMobile } from "@/hooks/use-mobile";

interface RadarChartDisplayProps {
  concepts: Concept[];
  chartData: any[];
  chartConfig: {[key: string]: {color?: string}};
  highlighted: string | null;
}

export const RadarChartDisplay = ({ 
  concepts, 
  chartData, 
  chartConfig, 
  highlighted 
}: RadarChartDisplayProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="w-full">
      <ChartContainer config={chartConfig} className="w-full h-full">
        <ResponsiveContainer width="100%" height={isMobile ? 400 : 600}>
          <RadarChart 
            outerRadius={isMobile ? "55%" : "65%"}
            data={chartData}
            margin={isMobile 
              ? { top: 10, right: 10, bottom: 80, left: 10 }
              : { top: 20, right: 30, bottom: 100, left: 30 }
            }
          >
            <PolarGrid strokeDasharray="3 3" stroke="#CBD5E1" />
            <PolarAngleAxis
              dataKey="criterion"
              tick={<PolarAxisTick concepts={concepts} highlighted={highlighted} chartData={chartData} />}
              axisLine={{ stroke: "#E2E8F0", strokeWidth: 1 }}
              tickLine={false}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 10]}
              tickCount={isMobile ? 4 : 6}
              tick={{ fontSize: isMobile ? 10 : 12, fill: "#64748B" }}
              axisLine={false}
              stroke="#CBD5E1"
            />
            <ChartTooltip content={<RadarTooltip />} />

            {concepts.map((concept, index) => (
              <Radar
                key={index}
                name={concept.name}
                dataKey={concept.name}
                stroke={concept.color}
                fill={concept.color}
                fillOpacity={highlighted === concept.name ? 0.5 : 0.2}
                strokeWidth={highlighted === concept.name ? 3 : 2}
                isAnimationActive={true}
                animationDuration={500}
                style={{ display: highlighted && highlighted !== concept.name ? 'none' : 'block' }}
              />
            ))}

            <Legend 
              wrapperStyle={{ bottom: isMobile ? -60 : -80 }}
              iconSize={isMobile ? 12 : 16}
              iconType="circle"
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              formatter={(value) => {
                return (
                  <span style={{ 
                    color: highlighted === value ? 'black' : '#4B5563', 
                    fontWeight: highlighted === value ? 'bold' : 'normal',
                    padding: '0 10px',
                    fontSize: isMobile ? '12px' : '14px'
                  }}>
                    {value}
                  </span>
                );
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};


import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { Concept } from "@/types/concept";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { RadarTooltip } from "./RadarTooltip";
import { PolarAxisTick } from "./PolarAxisTick";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChartBadges } from "./ChartBadges";

interface RadarChartDisplayProps {
  concepts: Concept[];
  chartData: any[];
  chartConfig: {[key: string]: {color?: string}};
  highlighted: string | null;
  onToggleHighlight: (name: string) => void;
}

export const RadarChartDisplay = ({ 
  concepts, 
  chartData, 
  chartConfig, 
  highlighted,
  onToggleHighlight
}: RadarChartDisplayProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="w-full flex flex-col">
      <ChartContainer config={chartConfig} className="w-full h-full">
        <ResponsiveContainer width="100%" height={isMobile ? 450 : 700}>
          <RadarChart 
            outerRadius={isMobile ? "55%" : "70%"}
            data={chartData}
            margin={isMobile 
              ? { top: 20, right: 20, bottom: 20, left: 20 }
              : { top: 40, right: 40, bottom: 40, left: 40 }
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
              tickCount={isMobile ? 3 : 6}
              tick={{ fontSize: isMobile ? 9 : 12, fill: "#64748B" }}
              axisLine={false}
              stroke="#CBD5E1"
              tickFormatter={(value) => isMobile && value % 5 !== 0 ? '' : value}
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
          </RadarChart>
        </ResponsiveContainer>
      </ChartContainer>
      
      <div className={`mt-${isMobile ? '4' : '6'}`}>
        <ChartBadges
          concepts={concepts}
          highlighted={highlighted}
          onToggle={onToggleHighlight}
        />
      </div>
    </div>
  );
};

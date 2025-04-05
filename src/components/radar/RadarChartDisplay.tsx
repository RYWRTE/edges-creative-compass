
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
  return (
    <div className="w-full">
      <ChartContainer config={chartConfig} className="w-full h-full pt-10 pb-20">
        <ResponsiveContainer width="100%" height={720}>
          <RadarChart 
            outerRadius="50%"
            data={chartData}
            margin={{ top: 120, right: 120, bottom: 120, left: 120 }}
          >
            <PolarGrid strokeDasharray="4 4" stroke="#CBD5E1" />
            <PolarAngleAxis
              dataKey="criterion"
              tick={<PolarAxisTick concepts={concepts} highlighted={highlighted} chartData={chartData} />}
              axisLine={{ stroke: "#E2E8F0", strokeWidth: 1 }}
              tickLine={false}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 10]}
              tickCount={6}
              tick={{ fontSize: 12, fill: "#64748B" }}
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
              wrapperStyle={{ bottom: -80, paddingTop: "100px" }}
              iconSize={18}
              iconType="circle"
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              formatter={(value) => {
                return (
                  <span style={{ 
                    color: highlighted === value ? 'black' : '#4B5563', 
                    fontWeight: highlighted === value ? 'bold' : 'normal',
                    padding: '0 18px',
                    fontSize: '16px'
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

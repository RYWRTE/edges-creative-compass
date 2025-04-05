
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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

  // Extract criteria names from chart data
  const criteriaNames = chartData.map(item => item.criterion);

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Chart Container */}
      <div className="w-full">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <ResponsiveContainer width="100%" height={isMobile ? 585 : 910}>
            <RadarChart 
              outerRadius={isMobile ? "65%" : "80%"}
              data={chartData}
              margin={isMobile 
                ? { top: 60, right: 60, bottom: 60, left: 60 }
                : { top: 100, right: 100, bottom: 100, left: 100 }
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
      </div>
      
      <div className={`mt-${isMobile ? '4' : '6'}`}>
        <ChartBadges
          concepts={concepts}
          highlighted={highlighted}
          onToggle={onToggleHighlight}
        />
      </div>
      
      {/* Table Container */}
      <div className="w-full mt-8">
        <h3 className="text-lg font-semibold mb-4">Asset Ratings</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Asset</TableHead>
                {criteriaNames.map((criterion, index) => (
                  <TableHead key={index} className="text-center">{criterion}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {concepts.map((concept, conceptIndex) => (
                <TableRow key={conceptIndex} className={highlighted === concept.name ? "bg-muted/20" : ""}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: concept.color }}
                      ></div>
                      {concept.name}
                    </div>
                  </TableCell>
                  {criteriaNames.map((criterion, criterionIndex) => {
                    const value = chartData[criterionIndex][concept.name];
                    return (
                      <TableCell key={criterionIndex} className="text-center">
                        <span className="font-mono">{value}</span>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

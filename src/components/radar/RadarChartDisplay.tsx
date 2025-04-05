
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
    <div className="w-full grid grid-cols-1 gap-8">
      {/* Radar Chart Container - Compact layout */}
      <div className="w-full bg-white rounded-lg p-4 shadow-sm">
        <div className="w-full mx-auto" style={{ height: isMobile ? "500px" : "700px" }}>
          <ChartContainer config={chartConfig} className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart 
                outerRadius={isMobile ? "70%" : "85%"}
                data={chartData}
                margin={isMobile 
                  ? { top: 40, right: 40, bottom: 40, left: 40 }
                  : { top: 80, right: 80, bottom: 80, left: 80 }
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
        
        <div className="mt-4">
          <ChartBadges
            concepts={concepts}
            highlighted={highlighted}
            onToggle={onToggleHighlight}
          />
        </div>
      </div>
      
      {/* Table Container - Compact layout */}
      <div className="w-full bg-white rounded-lg p-4 shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Criteria</TableHead>
                {concepts.map((concept, index) => (
                  <TableHead key={index} className="text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: concept.color }}
                      ></div>
                      {concept.name}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {criteriaNames.map((criterion, criterionIndex) => (
                <TableRow key={criterionIndex}>
                  <TableCell className="font-medium">{criterion}</TableCell>
                  {concepts.map((concept, conceptIndex) => {
                    const value = chartData[criterionIndex][concept.name];
                    return (
                      <TableCell key={conceptIndex} className="text-center">
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

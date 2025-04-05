
import { useRadarChartData } from "@/components/radar/useRadarChartData";
import { ChartBadges } from "@/components/radar/ChartBadges";
import { RadarChartDisplay } from "@/components/radar/RadarChartDisplay";
import { Concept } from "@/types/concept";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface EdgesRadarChartProps {
  concepts: Concept[];
}

const EdgesRadarChart = ({ concepts }: EdgesRadarChartProps) => {
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const isMobile = useIsMobile();
  
  // Simplified, removed zoom and rotation states
  const { chartData, chartConfig } = useRadarChartData(concepts);

  const handleConceptToggle = (name: string) => {
    setHighlighted(highlighted === name ? null : name);
  };

  return (
    <div className={`flex flex-col ${isMobile ? 'gap-2' : 'gap-4'} w-full h-full`}>
      {/* Remove ChartBadges from here as we've moved it inside RadarChartDisplay */}
      <RadarChartDisplay
        concepts={concepts}
        chartData={chartData}
        chartConfig={chartConfig}
        highlighted={highlighted}
        onToggleHighlight={handleConceptToggle}
      />
    </div>
  );
};

export default EdgesRadarChart;

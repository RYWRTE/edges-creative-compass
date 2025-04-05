
import { useRadarChartData } from "@/components/radar/useRadarChartData";
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
  
  // Get chart data and config
  const { chartData, chartConfig } = useRadarChartData(concepts);

  const handleConceptToggle = (name: string) => {
    setHighlighted(highlighted === name ? null : name);
  };

  return (
    <div className={`flex flex-col ${isMobile ? 'gap-5' : 'gap-8'} w-full h-full`}>
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

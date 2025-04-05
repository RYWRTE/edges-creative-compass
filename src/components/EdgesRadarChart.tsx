
import { useRadarChartData } from "@/components/radar/useRadarChartData";
import { ChartBadges } from "@/components/radar/ChartBadges";
import { RadarChartDisplay } from "@/components/radar/RadarChartDisplay";
import { Concept } from "@/types/concept";
import { useState } from "react";

interface EdgesRadarChartProps {
  concepts: Concept[];
}

const EdgesRadarChart = ({ concepts }: EdgesRadarChartProps) => {
  const [highlighted, setHighlighted] = useState<string | null>(null);
  
  // Simplified, removed zoom and rotation states
  const { chartData, chartConfig } = useRadarChartData(concepts);

  const handleConceptToggle = (name: string) => {
    setHighlighted(highlighted === name ? null : name);
  };

  return (
    <div className="flex flex-col gap-8 w-full h-full">
      <ChartBadges 
        concepts={concepts}
        highlighted={highlighted}
        onToggle={handleConceptToggle}
      />
      
      <RadarChartDisplay
        concepts={concepts}
        chartData={chartData}
        chartConfig={chartConfig}
        highlighted={highlighted}
      />
    </div>
  );
};

export default EdgesRadarChart;

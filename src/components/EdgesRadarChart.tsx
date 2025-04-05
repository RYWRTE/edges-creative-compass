
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip,
  Label,
} from "recharts";
import { Concept } from "@/types/concept";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { Download, ZoomIn, ZoomOut, RotateCw } from "lucide-react";

interface EdgesRadarChartProps {
  concepts: Concept[];
}

const EdgesRadarChart = ({ concepts }: EdgesRadarChartProps) => {
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [animating, setAnimating] = useState<boolean>(false);
  
  // Transforming the data for the radar chart
  const transformDataForRadarChart = () => {
    const criteria = [
      { name: "entertaining", label: "ENTERTAINING" },
      { name: "daring", label: "DARING" },
      { name: "gripping", label: "GRIPPING" },
      { name: "experiential", label: "EXPERIENTIAL" },
      { name: "subversive", label: "SUBVERSIVE" },
    ];

    // Create an array of objects, each representing a criterion
    return criteria.map((criterion) => {
      const dataPoint: { [key: string]: any } = {
        criterion: criterion.label,
      };

      // Add each concept's value for this criterion
      concepts.forEach((concept) => {
        dataPoint[concept.name] = concept[criterion.name as keyof Omit<Concept, "name" | "color">];
      });

      // Add individual concept scores for label display
      concepts.forEach((concept) => {
        dataPoint[`${concept.name}_value`] = concept[criterion.name as keyof Omit<Concept, "name" | "color">];
      });

      return dataPoint;
    });
  };

  const chartData = transformDataForRadarChart();

  // Handle exporting the chart as an image
  const handleExport = () => {
    try {
      const svg = document.querySelector('.recharts-wrapper svg') as SVGElement;
      if (!svg) return;
      
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      // Set canvas dimensions to match SVG
      const svgRect = svg.getBoundingClientRect();
      canvas.width = svgRect.width;
      canvas.height = svgRect.height;
      
      img.onload = () => {
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL('image/png');
        
        // Create download link
        const downloadLink = document.createElement('a');
        downloadLink.download = 'edges-chart.png';
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    } catch (error) {
      console.error("Error exporting chart:", error);
    }
  };

  // Toggle concept highlight
  const handleConceptToggle = (name: string) => {
    setHighlighted(highlighted === name ? null : name);
  };
  
  // Zoom in/out handlers
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 2));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };
  
  // Rotate the chart
  const handleRotate = () => {
    setAnimating(true);
    setTimeout(() => {
      setRotation((prev) => (prev + 72) % 360);
      setAnimating(false);
    }, 50);
  };

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow-sm">
          <p className="font-bold">{payload[0].payload.criterion}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom rendering function for labels with metrics
  const renderPolarAngleAxisTick = (props: any) => {
    const { x, y, payload, textAnchor, fontSize } = props;
    
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          textAnchor={textAnchor}
          fill="#4B5563"
          fontSize={fontSize}
          fontWeight={500}
        >
          {payload.value}
        </text>
        
        {/* Render individual concept values with their respective colors */}
        {concepts.length > 0 ? (
          concepts.map((concept, index) => {
            // Skip if a concept is highlighted and this isn't it
            if (highlighted && highlighted !== concept.name) return null;
            
            const value = chartData.find(item => item.criterion === payload.value)?.[`${concept.name}_value`] || 0;
            return (
              <text
                key={index}
                x={0}
                y={16 + (index * 12)} // Stack the values vertically with spacing
                textAnchor={textAnchor}
                fill={concept.color || "#4B5563"}
                fontSize={highlighted ? 10 : 9}
                fontWeight={highlighted === concept.name ? 600 : 500}
              >
                {concept.name}: {value}
              </text>
            );
          })
        ) : null}
      </g>
    );
  };

  // Prepare the config for the chart based on concepts
  const createChartConfig = () => {
    const config: {[key: string]: {color?: string}} = {};
    concepts.forEach(concept => {
      config[concept.name] = {
        color: concept.color || "#000000"
      };
    });
    return config;
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex flex-wrap gap-2 justify-center">
        {concepts.map((concept) => (
          <Badge 
            key={concept.name}
            variant={highlighted === concept.name ? "default" : "outline"}
            className="cursor-pointer"
            style={{ 
              backgroundColor: highlighted === concept.name ? concept.color : 'transparent',
              borderColor: concept.color,
              color: highlighted === concept.name ? 'white' : concept.color
            }}
            onClick={() => handleConceptToggle(concept.name)}
          >
            {concept.name}
          </Badge>
        ))}
      </div>
      
      <div className="flex justify-center gap-2 mb-2">
        <Button variant="outline" size="sm" onClick={handleZoomOut} title="Zoom Out">
          <ZoomOut size={16} />
        </Button>
        <Button variant="outline" size="sm" onClick={handleZoomIn} title="Zoom In">
          <ZoomIn size={16} />
        </Button>
        <Button variant="outline" size="sm" onClick={handleRotate} title="Rotate Chart">
          <RotateCw size={16} />
        </Button>
        <Button variant="outline" size="sm" onClick={handleExport} title="Export as PNG">
          <Download size={16} />
        </Button>
      </div>
      
      <div 
        className={`transition-transform ${animating ? 'opacity-0' : 'opacity-100'}`} 
        style={{ transform: `scale(${zoomLevel}) rotate(${rotation}deg)` }}
      >
        <ChartContainer config={createChartConfig()} className="w-full h-full">
          <RadarChart 
            outerRadius="60%" // Reduced to make room for the labels
            data={chartData}
            margin={{ top: 25, right: 25, bottom: 25, left: 25 }}
          >
            <PolarGrid strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="criterion"
              tick={renderPolarAngleAxisTick}
              axisLine={false}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 10]}
              tickCount={5}
              tick={{ fontSize: 10 }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />

            {concepts.map((concept, index) => (
              <Radar
                key={index}
                name={concept.name}
                dataKey={concept.name}
                stroke={concept.color}
                fill={concept.color}
                fillOpacity={highlighted === concept.name ? 0.4 : 0.2}
                strokeWidth={highlighted === concept.name ? 2 : 1}
                isAnimationActive={true} // Enable animations
                animationDuration={500} // Set animation duration
                style={{ display: highlighted && highlighted !== concept.name ? 'none' : 'block' }}
              />
            ))}

            <Legend 
              formatter={(value) => {
                return <span style={{ color: highlighted === value ? 'black' : 'gray', fontWeight: highlighted === value ? 'bold' : 'normal' }}>{value}</span>;
              }}
            />
          </RadarChart>
        </ChartContainer>
      </div>
    </div>
  );
};

export default EdgesRadarChart;

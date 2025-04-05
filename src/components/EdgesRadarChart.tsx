
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
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EdgesRadarChartProps {
  concepts: Concept[];
}

const EdgesRadarChart = ({ concepts }: EdgesRadarChartProps) => {
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [animating, setAnimating] = useState<boolean>(false);
  
  const transformDataForRadarChart = () => {
    const criteria = [
      { name: "entertaining", label: "ENTERTAINING" },
      { name: "daring", label: "DARING" },
      { name: "gripping", label: "GRIPPING" },
      { name: "experiential", label: "EXPERIENTIAL" },
      { name: "subversive", label: "SUBVERSIVE" },
    ];

    return criteria.map((criterion) => {
      const dataPoint: { [key: string]: any } = {
        criterion: criterion.label,
      };

      concepts.forEach((concept) => {
        dataPoint[concept.name] = concept[criterion.name as keyof Omit<Concept, "name" | "color">];
      });

      concepts.forEach((concept) => {
        dataPoint[`${concept.name}_value`] = concept[criterion.name as keyof Omit<Concept, "name" | "color">];
      });

      return dataPoint;
    });
  };

  const chartData = transformDataForRadarChart();

  const handleExport = () => {
    try {
      const svg = document.querySelector('.recharts-wrapper svg') as SVGElement;
      if (!svg) return;
      
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      const svgRect = svg.getBoundingClientRect();
      canvas.width = svgRect.width;
      canvas.height = svgRect.height;
      
      img.onload = () => {
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL('image/png');
        
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

  const handleConceptToggle = (name: string) => {
    setHighlighted(highlighted === name ? null : name);
  };
  
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 2));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };
  
  const handleRotate = () => {
    setAnimating(true);
    setTimeout(() => {
      setRotation((prev) => (prev + 72) % 360);
      setAnimating(false);
    }, 50);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded shadow-md max-w-[250px]">
          <p className="font-bold text-base mb-3">{payload[0].payload.criterion}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="flex items-center gap-2 mb-2" style={{ color: entry.color }}>
              <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: entry.color }}></span>
              <span className="font-medium">{entry.name}:</span> 
              <span className="font-bold">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderPolarAngleAxisTick = (props: any) => {
    const { x, y, payload, textAnchor } = props;
    const isSideAxis = Math.abs(x - 250) > 200; // Check if the axis is on the far sides
    
    // Calculate alignment based on position - helps with spacing text properly
    let alignment = textAnchor;
    let xOffset = 0;
    
    if (isSideAxis) {
      // Give more space for side labels
      xOffset = x < 250 ? -20 : 20;
      alignment = x < 250 ? "end" : "start";
    }
    
    return (
      <g transform={`translate(${x + xOffset},${y})`}>
        <text
          x={0}
          y={0}
          textAnchor={alignment}
          fill="#1E293B" // Darker text for better contrast
          fontSize={14}
          fontWeight={700}
          className="uppercase"
        >
          {payload.value}
        </text>
        
        {/* If we're not highlighting anything, show average values */}
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
        
        {/* If we're showing all concepts or just one highlighted one */}
        {concepts.length > 0 ? (
          <g>
            {concepts.map((concept, index) => {
              if (highlighted && highlighted !== concept.name) return null;
              
              const value = chartData.find(item => item.criterion === payload.value)?.[`${concept.name}_value`] || 0;
              return (
                <text
                  key={index}
                  x={0}
                  y={highlighted ? 24 : (48 + (index * 24))} // Much more vertical spacing
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

  // Removed the duplicate chartData declaration that was here

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
    <div className="flex flex-col gap-8 w-full h-full">
      <div className="flex flex-wrap gap-3 justify-center mb-4">
        {concepts.map((concept) => (
          <Badge 
            key={concept.name}
            variant={highlighted === concept.name ? "default" : "outline"}
            className="cursor-pointer px-4 py-2 text-sm"
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
      
      <div className="flex justify-center gap-4 mb-8">
        <TooltipProvider>
          <UITooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={handleZoomOut} className="px-4 py-2">
                <ZoomOut size={18} className="mr-2" /> Zoom Out
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Make the chart smaller</p>
            </TooltipContent>
          </UITooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <UITooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={handleZoomIn} className="px-4 py-2">
                <ZoomIn size={18} className="mr-2" /> Zoom In
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Make the chart larger</p>
            </TooltipContent>
          </UITooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <UITooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={handleRotate} className="px-4 py-2">
                <RotateCw size={18} className="mr-2" /> Rotate
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Rotate the chart axes</p>
            </TooltipContent>
          </UITooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <UITooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={handleExport} className="px-4 py-2">
                <Download size={18} className="mr-2" /> Export
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Save chart as PNG image</p>
            </TooltipContent>
          </UITooltip>
        </TooltipProvider>
      </div>
      
      <div 
        className={`transition-all duration-300 ${animating ? 'opacity-0' : 'opacity-100'}`} 
        style={{ transform: `scale(${zoomLevel}) rotate(${rotation}deg)` }}
      >
        <ChartContainer config={createChartConfig()} className="w-full h-full pt-12 pb-20">
          <ResponsiveContainer width="100%" height={700}>
            <RadarChart 
              outerRadius="60%"
              data={chartData}
              margin={{ top: 100, right: 100, bottom: 100, left: 100 }}
            >
              <PolarGrid strokeDasharray="4 4" stroke="#CBD5E1" />
              <PolarAngleAxis
                dataKey="criterion"
                tick={renderPolarAngleAxisTick}
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
              <ChartTooltip content={<CustomTooltip />} />

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
                wrapperStyle={{ bottom: -70, paddingTop: "80px" }}
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
                      padding: '0 16px',
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
    </div>
  );
};

export default EdgesRadarChart;

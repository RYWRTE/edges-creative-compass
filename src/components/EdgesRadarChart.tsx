
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Concept } from "@/types/concept";

interface EdgesRadarChartProps {
  concepts: Concept[];
}

const EdgesRadarChart = ({ concepts }: EdgesRadarChartProps) => {
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

      // Add the average value to display in the label
      if (concepts.length > 0) {
        let sum = 0;
        concepts.forEach((concept) => {
          sum += concept[criterion.name as keyof Omit<Concept, "name" | "color">] as number;
        });
        dataPoint.average = Math.round((sum / concepts.length) * 10) / 10; // Round to 1 decimal
      } else {
        dataPoint.average = 0;
      }

      return dataPoint;
    });
  };

  const chartData = transformDataForRadarChart();

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
    const value = chartData.find(item => item.criterion === payload.value)?.average || 0;
    
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
        <text
          x={0}
          y={16}
          textAnchor={textAnchor}
          fill="#4B5563"
          fontSize={9}
          fontWeight={500}  // Kept the same font weight as the label
        >
          ({value})
        </text>
      </g>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart 
        outerRadius="70%" 
        data={chartData}
        margin={{ top: 25, right: 25, bottom: 25, left: 25 }} // Increased margins for better label visibility
      >
        <PolarGrid strokeDasharray="3 3" />
        <PolarAngleAxis
          dataKey="criterion"
          tick={renderPolarAngleAxisTick}
          axisLine={false} // Remove axis line for cleaner look
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 10]}
          tickCount={5}
          tick={{ fontSize: 10 }}
        />
        <Tooltip content={<CustomTooltip />} />

        {concepts.map((concept, index) => (
          <Radar
            key={index}
            name={concept.name}
            dataKey={concept.name}
            stroke={concept.color}
            fill={concept.color}
            fillOpacity={0.2}
          />
        ))}

        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default EdgesRadarChart;

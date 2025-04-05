
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

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart outerRadius="80%" data={chartData}>
        <PolarGrid strokeDasharray="3 3" />
        <PolarAngleAxis
          dataKey="criterion"
          tick={{ fill: "#4B5563", fontSize: 12, fontWeight: 500 }}
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

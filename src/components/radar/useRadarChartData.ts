
import { Concept } from "@/types/concept";
import { useMemo } from "react";

export const useRadarChartData = (concepts: Concept[]) => {
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

  const chartData = useMemo(() => transformDataForRadarChart(), [concepts]);

  const createChartConfig = () => {
    const config: {[key: string]: {color?: string}} = {};
    concepts.forEach(concept => {
      config[concept.name] = {
        color: concept.color || "#000000"
      };
    });
    return config;
  };
  
  const chartConfig = useMemo(() => createChartConfig(), [concepts]);

  return { chartData, chartConfig };
};

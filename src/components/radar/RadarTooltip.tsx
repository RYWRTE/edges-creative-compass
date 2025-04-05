
import { useIsMobile } from "@/hooks/use-mobile";

export const RadarTooltip = ({ active, payload }: any) => {
  const isMobile = useIsMobile();
  
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border rounded-lg shadow-lg max-w-[200px]">
        <p className={`font-bold text-xs mb-1`}>
          {payload[0].payload.criterion}
        </p>
        <div className="space-y-0.5">
          {payload.map((entry: any, index: number) => (
            <p key={index} className="flex items-center gap-1 text-[10px]" style={{ color: entry.color }}>
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: entry.color }}></span>
              <span className="font-medium">{isMobile ? entry.name.substring(0, 10) : entry.name}:</span> 
              <span className="font-bold">{entry.value}</span>
            </p>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

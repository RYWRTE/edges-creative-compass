
import { useIsMobile } from "@/hooks/use-mobile";

export const RadarTooltip = ({ active, payload }: any) => {
  const isMobile = useIsMobile();
  
  if (active && payload && payload.length) {
    return (
      <div className={`bg-white p-${isMobile ? '2' : '4'} border rounded-lg shadow-lg ${isMobile ? 'max-w-[200px]' : 'max-w-[250px]'}`}>
        <p className={`font-bold ${isMobile ? 'text-sm' : 'text-base'} mb-${isMobile ? '1' : '2'}`}>
          {payload[0].payload.criterion}
        </p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <p key={index} className={`flex items-center gap-1 ${isMobile ? 'text-xs' : 'text-sm'}`} style={{ color: entry.color }}>
              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: entry.color }}></span>
              <span className="font-medium">{entry.name}:</span> 
              <span className="font-bold">{entry.value}</span>
            </p>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

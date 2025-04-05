
import { useIsMobile } from "@/hooks/use-mobile";

export const RadarTooltip = ({ active, payload }: any) => {
  const isMobile = useIsMobile();
  
  if (active && payload && payload.length) {
    return (
      <div className={`bg-white p-${isMobile ? '1.5' : '4'} border rounded-lg shadow-lg ${isMobile ? 'max-w-[150px]' : 'max-w-[250px]'}`}>
        <p className={`font-bold ${isMobile ? 'text-xs' : 'text-base'} mb-${isMobile ? '0.5' : '2'}`}>
          {payload[0].payload.criterion}
        </p>
        <div className={`space-y-${isMobile ? '0.5' : '1'}`}>
          {payload.map((entry: any, index: number) => (
            <p key={index} className={`flex items-center gap-1 ${isMobile ? 'text-[10px]' : 'text-sm'}`} style={{ color: entry.color }}>
              <span className={`w-${isMobile ? '1.5' : '2'} h-${isMobile ? '1.5' : '2'} rounded-full inline-block`} style={{ backgroundColor: entry.color }}></span>
              <span className="font-medium">{isMobile ? entry.name.substring(0, 12) : entry.name}:</span> 
              <span className="font-bold">{entry.value}</span>
            </p>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

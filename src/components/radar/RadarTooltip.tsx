
export const RadarTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border rounded-lg shadow-lg max-w-[250px]">
        <p className="font-bold text-base mb-2">{payload[0].payload.criterion}</p>
        <div className="space-y-2">
          {payload.map((entry: any, index: number) => (
            <p key={index} className="flex items-center gap-2 text-sm" style={{ color: entry.color }}>
              <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: entry.color }}></span>
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

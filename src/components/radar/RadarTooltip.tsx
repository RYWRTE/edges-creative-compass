
export const RadarTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-5 border rounded-lg shadow-lg max-w-[300px]">
        <p className="font-bold text-lg mb-4">{payload[0].payload.criterion}</p>
        <div className="space-y-3">
          {payload.map((entry: any, index: number) => (
            <p key={index} className="flex items-center gap-3 text-sm" style={{ color: entry.color }}>
              <span className="w-5 h-5 rounded-full inline-block" style={{ backgroundColor: entry.color }}></span>
              <span className="font-medium">{entry.name}:</span> 
              <span className="font-bold text-base">{entry.value}</span>
            </p>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

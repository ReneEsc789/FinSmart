import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const data = [
  { value: 400 }, { value: 300 }, { value: 600 }, { value: 800 },
  { value: 500 }, { value: 900 }, { value: 1100 }, { value: 800 },
  { value: 1200 }, { value: 1000 }, { value: 1400 }, { value: 1600 },
];

export const BackgroundChart = () => {
  return (
    <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#8b5cf6" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorValue)" 
            animationDuration={2000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

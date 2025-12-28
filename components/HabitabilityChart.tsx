
import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { Exoplanet, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface HabitabilityChartProps {
  planets: Exoplanet[];
  lang: Language;
}

const HabitabilityChart: React.FC<HabitabilityChartProps> = ({ planets, lang }) => {
  const t = TRANSLATIONS[lang];
  
  const data = planets.map(p => ({
    name: p.name,
    mass: p.massEarths,
    radius: p.radiusEarths,
    score: p.habitabilityScore,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const p = payload[0].payload;
      return (
        <div className="bg-slate-900/90 backdrop-blur-md border border-cyan-500/30 p-3 rounded shadow-xl">
          <p className="font-bold text-cyan-400">{p.name}</p>
          <p className="text-xs text-white">Mass: {p.mass} M⊕</p>
          <p className="text-xs text-white">Radius: {p.radius} R⊕</p>
          <p className="text-xs font-bold mt-1 text-green-400">Score: {p.score}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64 bg-slate-900/30 rounded-xl border border-slate-800 p-4">
      <h4 className="text-xs uppercase font-bold text-slate-500 mb-4 flex justify-between">
        <span>Mass-Radius Habitability Matrix</span>
        <span className="text-cyan-400">Sphere Size = Habitability</span>
      </h4>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: -10 }}>
          <XAxis 
            type="number" 
            dataKey="mass" 
            name="Mass" 
            unit=" M⊕" 
            stroke="#475569" 
            fontSize={10}
            domain={[0, 'auto']}
          />
          <YAxis 
            type="number" 
            dataKey="radius" 
            name="Radius" 
            unit=" R⊕" 
            stroke="#475569" 
            fontSize={10}
            domain={[0, 'auto']}
          />
          <ZAxis type="number" dataKey="score" range={[100, 1000]} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine x={1} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: 'Earth Mass', fill: '#ef4444', fontSize: 8 }} />
          <ReferenceLine y={1} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'right', value: 'Earth Radius', fill: '#ef4444', fontSize: 8 }} />
          <Scatter name="Planets" data={data}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.score > 80 ? '#22d3ee' : '#3b82f6'} 
                fillOpacity={0.6}
                stroke={entry.score > 80 ? '#06b6d4' : '#2563eb'}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HabitabilityChart;

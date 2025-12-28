
import React, { useState, useEffect } from 'react';
import { ADVANCED_TRANSLATIONS } from '../constants';
import { Language } from '../types';
import { Telescope, Radar, Cpu, Image as ImageIcon, Map } from 'lucide-react';

interface LoadingScreenProps {
  lang: Language;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ lang }) => {
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const t = ADVANCED_TRANSLATIONS[lang];
  
  const icons = [
    <Telescope size={48} className="text-cyan-400" />,
    <Radar size={48} className="text-blue-400" />,
    <Cpu size={48} className="text-purple-400" />,
    <ImageIcon size={48} className="text-indigo-400" />,
    <Map size={48} className="text-teal-400" />
  ];

  useEffect(() => {
    const stageInterval = setInterval(() => {
      setStage(prev => (prev < t.loadingStages.length - 1 ? prev + 1 : prev));
    }, 2500);

    const progressInterval = setInterval(() => {
      setProgress(prev => (prev < 95 ? prev + 0.5 : prev));
    }, 50);

    return () => {
      clearInterval(stageInterval);
      clearInterval(progressInterval);
    };
  }, [t.loadingStages.length]);

  return (
    <div className="flex flex-col items-center justify-center py-32 animate-in fade-in zoom-in-95 duration-700">
      <div className="relative mb-12">
        {/* Pulsing Scan Effect */}
        <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full animate-pulse"></div>
        
        <div className="relative w-40 h-40 flex items-center justify-center">
          {/* Rotating Rings */}
          <div className="absolute inset-0 border-2 border-slate-800 rounded-full"></div>
          <div className="absolute inset-2 border-2 border-cyan-500/30 border-t-transparent rounded-full animate-[spin_3s_linear_infinite]"></div>
          <div className="absolute inset-4 border-2 border-blue-500/20 border-b-transparent rounded-full animate-[spin_5s_linear_infinite_reverse]"></div>
          
          <div className="transition-all duration-700 transform hover:scale-110">
            {icons[stage]}
          </div>
        </div>
      </div>

      <div className="text-center max-w-sm">
        <h3 className="text-2xl font-orbitron font-bold text-white mb-4 tracking-wider">
          {t.loadingStages[stage]}
        </h3>
        
        <div className="w-64 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800 mb-4 mx-auto">
          <div 
            className="h-full bg-gradient-to-r from-cyan-600 via-blue-500 to-indigo-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <p className="text-xs uppercase tracking-[0.2em] font-bold text-slate-500 animate-pulse">
          Transmission Intercepted ... {Math.round(progress)}%
        </p>
      </div>

      {/* Twinkling ambient stars specifically for loading */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              width: Math.random() * 3 + 'px',
              height: Math.random() * 3 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDelay: Math.random() * 2 + 's',
              animationDuration: Math.random() * 1 + 1 + 's'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingScreen;

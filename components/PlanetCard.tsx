
import React, { useState, useEffect } from 'react';
import { Exoplanet, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { generatePlanetImage } from '../services/geminiService';
import { Sparkles, Globe, MapPin, Calendar, Scale, Maximize, Scan, Target, ExternalLink } from 'lucide-react';

interface PlanetCardProps {
  planet: Exoplanet;
  lang: Language;
  onClick?: () => void;
}

const PlanetCard: React.FC<PlanetCardProps> = ({ planet, lang, onClick }) => {
  const [imgUrl, setImgUrl] = useState<string>(planet.imageUrl || '');
  const [loadingImg, setLoadingImg] = useState(!planet.imageUrl);
  const [imageLoaded, setImageLoaded] = useState(false);
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    if (!planet.imageUrl) {
      const fetchImage = async () => {
        try {
          const url = await generatePlanetImage(planet.name, planet.description);
          setImgUrl(url);
        } catch (e) {
          console.error("Failed to load image", e);
          setImgUrl(`https://picsum.photos/seed/${planet.name}/800/450`);
        } finally {
          setLoadingImg(false);
        }
      };
      fetchImage();
    } else {
        setLoadingImg(false);
    }
  }, [planet.name, planet.description, planet.imageUrl]);

  return (
    <div 
      onClick={onClick}
      className={`group relative bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-3xl overflow-hidden hover:border-cyan-500/50 transition-all duration-700 hover:shadow-[0_20px_40px_rgba(6,182,212,0.1)] flex flex-col h-full ${onClick ? 'cursor-pointer active:scale-95' : ''}`}
    >
      <div className="aspect-[16/10] w-full bg-slate-950 relative overflow-hidden">
        {loadingImg ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950">
            <div className="relative w-full h-full overflow-hidden opacity-20">
                <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#06b6d4] animate-[scan_3s_linear_infinite] z-20" />
                <div className="grid grid-cols-16 grid-rows-10 h-full w-full gap-0.5 p-1">
                    {[...Array(160)].map((_, i) => (
                        <div key={i} className="bg-slate-900 border border-slate-800/30" />
                    ))}
                </div>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center z-30">
                <div className="relative mb-3">
                  <div className="absolute inset-0 border border-cyan-500/30 rounded-full animate-ping duration-[3s]" />
                  <div className="p-3 bg-cyan-500/10 rounded-full border border-cyan-500/30">
                    <Target size={28} className="text-cyan-500 animate-[pulse_1.5s_ease-in-out_infinite]" />
                  </div>
                </div>
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-[0.3em] animate-pulse">Imaging Protocol...</span>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full">
            <img 
              src={imgUrl} 
              alt={planet.name} 
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover transition-all duration-[1.5s] ease-out transform ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
            />
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
               <div className="absolute top-4 right-4 text-[8px] text-cyan-500 font-mono flex flex-col items-end opacity-40">
                  <span>RES: 4K HIGH DEPTH</span>
                  <span>SYNC: STABLE</span>
                  <span>RT: 24.5ms</span>
               </div>
               <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500/40 m-4 rounded-tl-lg" />
               <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-500/40 m-4 rounded-tr-lg" />
               <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-500/40 m-4 rounded-bl-lg" />
               <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-500/40 m-4 rounded-br-lg" />
            </div>
            {onClick && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/40 backdrop-blur-sm">
                <div className="px-4 py-2 bg-cyan-600 rounded-full text-white text-xs font-bold flex items-center gap-2 shadow-lg scale-90 group-hover:scale-100 transition-transform">
                  <ExternalLink size={14} /> View Details
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 pointer-events-none" />
          </div>
        )}
        
        <div className="absolute top-4 left-4 flex gap-2 z-20">
          {planet.isConfirmed && (
            <span className="px-2.5 py-1 bg-green-500/10 backdrop-blur-md border border-green-500/30 text-green-400 text-[9px] uppercase font-bold rounded-lg tracking-wider">
              Confirmed
            </span>
          )}
          <span className="px-2.5 py-1 bg-cyan-500/10 backdrop-blur-md border border-cyan-500/30 text-cyan-400 text-[9px] uppercase font-bold rounded-lg flex items-center gap-1.5 tracking-wider">
            <Sparkles size={11} className="text-cyan-400" /> {t.habitableScore}: {planet.habitabilityScore}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-orbitron font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors tracking-tight">
          {planet.name}
        </h3>
        <p className="text-slate-400 text-sm mb-6 line-clamp-2 italic font-light opacity-80 group-hover:opacity-100 transition-opacity">
          "{planet.description}"
        </p>

        <div className="grid grid-cols-2 gap-y-6 gap-x-4 mt-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-800/50 rounded-lg group-hover:bg-cyan-500/10 group-hover:text-cyan-400 transition-colors">
              <MapPin size={18} />
            </div>
            <div>
              <p className="text-[10px] uppercase text-slate-500 font-bold leading-tight tracking-widest">{t.distance}</p>
              <p className="text-sm font-semibold text-slate-200">{planet.distanceLy} LY</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-800/50 rounded-lg group-hover:bg-cyan-500/10 group-hover:text-cyan-400 transition-colors">
              <Scale size={18} />
            </div>
            <div>
              <p className="text-[10px] uppercase text-slate-500 font-bold leading-tight tracking-widest">{t.mass}</p>
              <p className="text-sm font-semibold text-slate-200">{planet.massEarths} M⊕</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-800/50 rounded-lg group-hover:bg-cyan-500/10 group-hover:text-cyan-400 transition-colors">
              <Maximize size={18} />
            </div>
            <div>
              <p className="text-[10px] uppercase text-slate-500 font-bold leading-tight tracking-widest">{t.radius}</p>
              <p className="text-sm font-semibold text-slate-200">{planet.radiusEarths} R⊕</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-800/50 rounded-lg group-hover:bg-cyan-500/10 group-hover:text-cyan-400 transition-colors">
              <Calendar size={18} />
            </div>
            <div>
              <p className="text-[10px] uppercase text-slate-500 font-bold leading-tight tracking-widest">{t.discovery}</p>
              <p className="text-sm font-semibold text-slate-200">{planet.discoveryYear}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-slate-800/50 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-cyan-600 via-cyan-400 to-blue-600 transition-all duration-[2s] group-hover:opacity-100 opacity-60 shadow-[0_0_10px_#06b6d4]"
          style={{ width: `${planet.habitabilityScore}%` }}
        />
      </div>
      
      <style>{`
        @keyframes scan {
          0% { top: -5%; }
          100% { top: 105%; }
        }
      `}</style>
    </div>
  );
};

export default PlanetCard;

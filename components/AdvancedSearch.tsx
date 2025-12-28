
import React from 'react';
import { ADVANCED_TRANSLATIONS, SPECTRAL_CLASSES } from '../constants';
import { Language } from '../types';
import { SlidersHorizontal, RefreshCcw, Earth, Sun } from 'lucide-react';
import { SearchFilters } from '../services/geminiService';

interface AdvancedSearchProps {
  lang: Language;
  filters: SearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  onReset: () => void;
  isOpen: boolean;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ lang, filters, setFilters, onReset, isOpen }) => {
  const t = ADVANCED_TRANSLATIONS[lang];

  if (!isOpen) return null;

  return (
    <div className="mt-4 p-6 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl animate-in slide-in-from-top-4 duration-300">
      <div className="flex items-center justify-between mb-6">
        <h4 className="flex items-center gap-2 text-sm font-orbitron font-bold text-white uppercase tracking-wider">
          <SlidersHorizontal size={16} className="text-cyan-400" />
          {t.advanced}
        </h4>
        <button 
          onClick={onReset}
          className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 hover:text-cyan-400 transition-colors uppercase"
        >
          <RefreshCcw size={12} />
          {t.reset}
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Mass Range */}
        <div className="space-y-4">
          <label className="text-xs font-bold text-slate-400 uppercase">{t.minMass}</label>
          <input 
            type="range" min="0" max="10" step="0.1"
            value={filters.minMass || 0}
            onChange={(e) => setFilters(prev => ({ ...prev, minMass: parseFloat(e.target.value) }))}
            className="w-full accent-cyan-500 bg-slate-800 h-1 rounded-full appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
             <span>0</span>
             <span className="text-cyan-400 font-bold">{filters.minMass || 0} M⊕</span>
             <span>10+</span>
          </div>
        </div>

        {/* Distance Range */}
        <div className="space-y-4">
          <label className="text-xs font-bold text-slate-400 uppercase">{t.maxDistance}</label>
          <input 
            type="range" min="0" max="5000" step="50"
            value={filters.maxDistance || 5000}
            onChange={(e) => setFilters(prev => ({ ...prev, maxDistance: parseInt(e.target.value) }))}
            className="w-full accent-blue-500 bg-slate-800 h-1 rounded-full appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
             <span>0</span>
             <span className="text-blue-400 font-bold">{filters.maxDistance || 'Any'} LY</span>
             <span>5000+</span>
          </div>
        </div>

        {/* Star Type Dropdown */}
        <div className="space-y-4">
          <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
            <Sun size={12} className="text-yellow-500" />
            {t.starType}
          </label>
          <select 
            value={filters.starType || 'any'}
            onChange={(e) => setFilters(prev => ({ ...prev, starType: e.target.value }))}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
          >
            {SPECTRAL_CLASSES.map(cls => (
              <option key={cls.id} value={cls.id}>
                {lang === 'en' ? cls.en : cls.zh}
              </option>
            ))}
          </select>
        </div>

        {/* Earth-like Toggle */}
        <div className="flex items-center justify-between p-4 bg-slate-950/40 rounded-xl border border-slate-800/50">
          <div className="flex items-center gap-3">
            <Earth size={20} className={filters.earthLikeOnly ? "text-green-400" : "text-slate-600"} />
            <div>
              <p className="text-xs font-bold text-white uppercase leading-none mb-1">{t.earthLikeOnly}</p>
              <p className="text-[9px] text-slate-500 uppercase font-bold tracking-tighter">Habitable Only</p>
            </div>
          </div>
          <button 
            onClick={() => setFilters(prev => ({ ...prev, earthLikeOnly: !prev.earthLikeOnly }))}
            className={`w-10 h-5 rounded-full transition-all relative ${filters.earthLikeOnly ? 'bg-cyan-600' : 'bg-slate-800'}`}
          >
            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${filters.earthLikeOnly ? 'right-1' : 'left-1'}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearch;

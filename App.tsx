
import React, { useState, useEffect, useRef } from 'react';
import StarBackground from './components/StarBackground';
import PlanetCard from './components/PlanetCard';
import HabitabilityChart from './components/HabitabilityChart';
import LoadingScreen from './components/LoadingScreen';
import AdvancedSearch from './components/AdvancedSearch';
import { Search, Globe, Github, Info, Compass, Loader2, ExternalLink, ChevronDown, ChevronUp, Star, Home, Sun, Sparkles, Activity } from 'lucide-react';
import { StarSystemData, Language, Exoplanet } from './types';
import { TRANSLATIONS, INITIAL_PLANETS, POPULAR_STARS } from './constants';
import { getExoplanetData, SearchFilters, generateStarImage } from './services/geminiService';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('zh');
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<StarSystemData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Autocomplete State
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Advanced Search State
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    minMass: 0.1,
    maxMass: 10,
    maxDistance: 2000,
    earthLikeOnly: false,
    starType: 'any'
  });

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (val.length > 0) {
      const filtered = POPULAR_STARS.filter(s => 
        s.toLowerCase().includes(val.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (name: string) => {
    setQuery(name);
    setShowSuggestions(false);
    handleSearchInternal(name);
  };

  const handleResetFilters = () => {
    setFilters({
      minMass: 0.1,
      maxMass: 10,
      maxDistance: 2000,
      earthLikeOnly: false,
      starType: 'any'
    });
  };

  const goHome = () => {
    setResults(null);
    setQuery('');
    setError(null);
    setIsAdvancedOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    setShowSuggestions(false);
    handleSearchInternal(query);
  };

  const handleSearchInternal = async (searchQuery: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getExoplanetData(searchQuery, lang, filters);
      
      // Fetch enhanced star image
      try {
        const starImg = await generateStarImage(data.starName, data.starType);
        data.starImageUrl = starImg;
      } catch (imgErr) {
        console.warn("Could not generate star image", imgErr);
      }

      setResults(data);
      // Scroll to top of results on success
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch celestial data. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      <StarBackground />
      
      {/* Header & Controls */}
      <nav className="sticky top-0 z-[100] bg-slate-950/70 backdrop-blur-2xl border-b border-white/5 px-6 py-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <button 
            onClick={goHome}
            className="flex items-center gap-3 group transition-transform hover:scale-[1.02] active:scale-95"
          >
            <div className="p-2 bg-cyan-500/20 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all">
              <Compass className="text-cyan-400" />
            </div>
            <div className="text-left hidden sm:block">
              <h1 className="font-orbitron text-xl font-bold tracking-wider text-white">
                {t.title} <span className="text-cyan-500">Explorer</span>
              </h1>
              <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold group-hover:text-cyan-600 transition-colors">
                {t.designer}
              </p>
            </div>
          </button>

          <div className="flex items-center gap-3">
            {results && (
              <button 
                onClick={goHome}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 rounded-full text-xs font-bold text-slate-400 hover:text-white hover:border-white/20 transition-all"
              >
                <Home size={14} />
                <span className="hidden md:inline">Home</span>
              </button>
            )}
            <button 
              onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 rounded-full text-xs font-bold hover:border-cyan-500 transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]"
            >
              <Globe size={14} className="text-cyan-400" />
              {lang === 'en' ? '中文' : 'English'}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* Hero Section */}
        {!results && !isLoading && (
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold tracking-widest uppercase">
              Celestial Mapping Protocol 2.5
            </div>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-orbitron font-bold mb-8 bg-gradient-to-br from-white via-slate-200 to-slate-500 bg-clip-text text-transparent leading-tight tracking-tighter whitespace-normal md:whitespace-nowrap">
              {t.subtitle}
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-xl mb-12 leading-relaxed font-light">
              Embark on a voyage to discover Earth-like worlds, using real-time astronomical datasets powered by advanced AI synthesis.
            </p>
          </div>
        )}

        {/* Search Bar & Advanced Search */}
        <div className={`max-w-3xl mx-auto transition-all duration-1000 ease-out ${results ? 'mb-16' : 'mb-24'}`}>
          <div ref={searchRef} className="relative z-50">
            <form onSubmit={handleSearch} className="relative group">
                <div className="absolute inset-0 bg-cyan-500/10 blur-3xl opacity-0 group-focus-within:opacity-100 transition-opacity rounded-3xl" />
                <input 
                  type="text"
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  onFocus={() => query.length > 0 && setShowSuggestions(suggestions.length > 0)}
                  placeholder={t.searchPlaceholder}
                  className="w-full bg-slate-900/80 backdrop-blur-xl border-2 border-slate-800 rounded-[1.5rem] py-6 pl-14 pr-40 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-8 focus:ring-cyan-500/5 transition-all text-xl shadow-2xl relative z-10 placeholder:text-slate-600"
                />
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-cyan-400 transition-colors z-20" size={28} />
                <div className="absolute right-3 top-2 bottom-2 flex items-center gap-2 z-20">
                  <button 
                      type="button"
                      onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                      className={`p-4 rounded-2xl border transition-all ${isAdvancedOpen ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]' : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:text-white'}`}
                      title="Advanced Filters"
                  >
                      {isAdvancedOpen ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
                  </button>
                  <button 
                      type="submit"
                      disabled={isLoading}
                      className="px-8 h-full bg-gradient-to-br from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-bold rounded-2xl transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 shadow-xl hover:shadow-cyan-500/20"
                  >
                      {isLoading ? <Loader2 className="animate-spin" size={22} /> : t.searchBtn}
                  </button>
                </div>
            </form>

            {/* Autocomplete Dropdown */}
            {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-slate-900/95 backdrop-blur-3xl border border-slate-800/80 rounded-2xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] z-[100] animate-in slide-in-from-top-4 duration-300">
                    <div className="px-5 py-3 border-b border-slate-800/50 bg-slate-950/40 text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em]">Suggestions</div>
                    {suggestions.map((suggestion, index) => (
                        <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="w-full text-left px-5 py-4 hover:bg-cyan-500/10 flex items-center gap-4 text-slate-300 hover:text-cyan-400 transition-all border-b border-slate-800/30 last:border-0 group"
                        >
                            <Star size={16} className="text-slate-700 group-hover:text-cyan-500/70 transition-colors" />
                            <span className="font-orbitron text-base tracking-wide">{suggestion}</span>
                        </button>
                    ))}
                </div>
            )}
          </div>
          
          <AdvancedSearch 
            lang={lang}
            filters={filters}
            setFilters={setFilters}
            onReset={handleResetFilters}
            isOpen={isAdvancedOpen}
          />
          
          {error && <p className="mt-6 text-red-400 text-sm text-center font-bold bg-red-500/10 py-3 rounded-2xl border border-red-500/20 shadow-lg">{error}</p>}
        </div>

        {/* Results Area */}
        {isLoading ? (
          <LoadingScreen lang={lang} />
        ) : results ? (
          <div className="space-y-16 animate-in fade-in zoom-in-95 duration-1000">
            {/* System Info Header */}
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-8 space-y-10">
                <div className="flex flex-wrap items-center gap-6">
                  {results.starImageUrl && (
                    <div className="relative w-28 h-28 rounded-full overflow-hidden shadow-[0_0_60px_rgba(255,165,0,0.5)] border-4 border-orange-500/10 group animate-in zoom-in duration-1000 hover:scale-105 transition-transform">
                      <img src={results.starImageUrl} alt={results.starName} className="w-full h-full object-cover scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-orange-500/30 to-transparent mix-blend-overlay" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-5xl md:text-7xl font-orbitron font-bold text-white tracking-tighter leading-tight drop-shadow-2xl">{results.starName}</h2>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-xs text-cyan-400 font-bold uppercase tracking-widest shadow-inner flex items-center gap-2">
                        <Sun size={12} className="text-yellow-500" /> Spectral: {results.starType}
                      </span>
                      {results.planets.length > 0 && (
                        <span className="px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-xl text-xs text-blue-400 font-bold uppercase tracking-widest shadow-inner flex items-center gap-2">
                          <Globe size={12} /> {results.planets.length} Habitables
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* AI System Summary Block */}
                <div className="relative group/summary">
                  <div className="absolute -top-3 left-6 px-3 py-1 bg-slate-900 border border-slate-700 rounded-lg text-[9px] font-bold text-cyan-500 uppercase tracking-[0.4em] z-20 flex items-center gap-2 shadow-xl">
                    <Activity size={10} className="animate-pulse" /> System_Analysis
                  </div>
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-500/60 via-cyan-500/20 to-transparent rounded-full" />
                  <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl p-8 border border-white/5 shadow-2xl group-hover/summary:border-cyan-500/20 transition-all duration-500">
                    <p className="text-slate-200 text-3xl leading-relaxed font-light italic pl-4 opacity-95 group-hover/summary:opacity-100 transition-opacity">
                      "{results.summary}"
                    </p>
                  </div>
                  <div className="absolute bottom-4 right-6 opacity-30 group-hover/summary:opacity-60 transition-opacity">
                    <Sparkles size={24} className="text-cyan-400" />
                  </div>
                </div>

                {results.sources.length > 0 && (
                  <div className="pt-4">
                    <h5 className="text-[10px] uppercase font-bold text-slate-600 mb-4 flex items-center gap-2 tracking-[0.3em]">
                      <ExternalLink size={14} /> Grounding Data Channels
                    </h5>
                    <div className="flex flex-wrap gap-3">
                      {results.sources.slice(0, 4).map((source, i) => (
                        <a 
                          key={i} 
                          href={source.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-5 py-2.5 bg-slate-900/40 border border-slate-800 rounded-2xl text-xs text-slate-500 hover:border-cyan-500 hover:text-cyan-400 hover:bg-cyan-500/5 transition-all flex items-center gap-3 group"
                        >
                          <span className="w-1.5 h-1.5 bg-slate-700 group-hover:bg-cyan-500 rounded-full transition-colors"></span>
                          {source.title.length > 35 ? source.title.substring(0, 35) + '...' : source.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="lg:col-span-4 bg-slate-900/40 backdrop-blur-3xl border border-slate-800/80 rounded-[2.5rem] p-8 shadow-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full -mr-24 -mt-24 blur-3xl group-hover:bg-cyan-500/10 transition-all duration-700" />
                <h4 className="font-bold text-[10px] text-slate-600 uppercase mb-8 tracking-[0.4em]">Habitability Matrix</h4>
                <HabitabilityChart planets={results.planets} lang={lang} />
              </div>
            </div>

            {/* Planet Gallery */}
            <div className="space-y-10">
               <div className="flex items-center gap-6">
                  <div className="h-px bg-gradient-to-r from-transparent via-slate-800 to-slate-800 flex-grow"></div>
                  <h3 className="font-orbitron text-xl text-slate-400 tracking-[0.2em] uppercase">Discovered Planets</h3>
                  <div className="h-px bg-gradient-to-r from-slate-800 via-slate-800 to-transparent flex-grow"></div>
               </div>
               {results.planets.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 pb-16">
                  {results.planets.map((planet, idx) => (
                    <PlanetCard key={idx} planet={planet} lang={lang} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-32 bg-slate-900/10 border-2 border-dashed border-slate-800/50 rounded-[4rem] group hover:border-slate-700/50 transition-colors">
                  <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <Info className="text-slate-600 group-hover:text-slate-500 transition-colors" size={40} />
                  </div>
                  <p className="text-slate-500 text-2xl font-orbitron mb-4 tracking-wider">{t.noResults}</p>
                  <button 
                    onClick={handleResetFilters}
                    className="text-cyan-500 hover:text-cyan-400 font-bold uppercase tracking-[0.3em] text-xs transition-colors"
                  >
                    Clear Filter Protocols
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Default View: Recent Discoveries */
          <div className="animate-in fade-in duration-1000 delay-500">
             <div className="flex items-center gap-8 mb-16">
                <h3 className="font-orbitron text-2xl text-white tracking-[0.3em] uppercase">{t.recentDiscoveries}</h3>
                <div className="h-px bg-gradient-to-r from-slate-800 to-transparent flex-grow"></div>
             </div>
             <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                {INITIAL_PLANETS.map((planet, idx) => (
                  <PlanetCard 
                    key={idx} 
                    planet={planet} 
                    lang={lang} 
                    onClick={() => handleSearchInternal(planet.name)}
                  />
                ))}
             </div>
          </div>
        )}
      </main>

      {/* Footer Credits */}
      <footer className="mt-32 py-24 border-t border-white/5 bg-slate-950/90 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-16 text-slate-500 text-sm">
          <div className="flex items-center gap-6">
             <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center font-bold text-cyan-400 text-2xl shadow-[0_0_30px_rgba(6,182,212,0.15)] transform -rotate-3 hover:rotate-0 transition-transform">
               D
             </div>
             <div className="text-left">
               <p className="font-orbitron font-bold text-white tracking-widest text-xl mb-1">{t.author}</p>
               <p className="text-[10px] uppercase font-bold text-slate-600 tracking-[0.4em]">Stellar Archive Division</p>
             </div>
          </div>
          <div className="text-center md:text-right max-w-sm">
            <p className="font-bold text-slate-400 mb-2 tracking-widest uppercase text-xs">{t.credits}</p>
            <p className="text-xs text-slate-600 leading-relaxed font-light italic">
              "Counting stars is not about the numbers, it's about finding where we belong among them."
            </p>
          </div>
          <div className="flex gap-8">
             <a href="#" className="p-4 bg-slate-900/50 rounded-2xl text-slate-600 hover:text-cyan-400 hover:bg-slate-900 border border-transparent hover:border-cyan-500/20 transition-all shadow-lg"><Github size={24} /></a>
             <a href="#" className="p-4 bg-slate-900/50 rounded-2xl text-slate-600 hover:text-cyan-400 hover:bg-slate-900 border border-transparent hover:border-cyan-500/20 transition-all shadow-lg"><Info size={24} /></a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/5 text-center">
          <p className="text-[9px] uppercase tracking-[0.8em] font-bold text-slate-800">DaKES Institute &copy; 2025 Deep Space Network</p>
        </div>
      </footer>
    </div>
  );
};

export default App;

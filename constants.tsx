
import { Translations } from './types';

export const POPULAR_STARS = [
  "Proxima Centauri",
  "TRAPPIST-1",
  "Teegarden's Star",
  "Kepler-186",
  "Kepler-452",
  "Kepler-1649",
  "LHS 1140",
  "Ross 128",
  "Gliese 667 C",
  "Gliese 581",
  "Wolf 1061",
  "Tau Ceti",
  "Alpha Centauri A",
  "Alpha Centauri B",
  "Barnard's Star",
  "Luyten's Star",
  "K2-18",
  "TOI-700"
];

export const SPECTRAL_CLASSES = [
  { id: 'any', en: 'All Types', zh: '所有类型' },
  { id: 'G', en: 'G-Type (Sun-like)', zh: 'G型 (类太阳)' },
  { id: 'M', en: 'M-Dwarf (Red Dwarf)', zh: 'M型 (红矮星)' },
  { id: 'K', en: 'K-Type (Orange Dwarf)', zh: 'K型 (橙矮星)' },
  { id: 'F', en: 'F-Type (Yellow-White)', zh: 'F型 (黄白矮星)' },
  { id: 'A', en: 'A-Type (White Star)', zh: 'A型 (白星)' }
];

export const TRANSLATIONS: Record<'en' | 'zh', Translations> = {
  en: {
    title: "Exoplanet",
    subtitle: "Charting Habitable Worlds",
    searchPlaceholder: "Enter star name (e.g. TRAPPIST-1, Proxima Centauri)...",
    searchBtn: "Explore",
    credits: "Designed by DaKES Institute",
    author: "Author: Fred Y. Ye",
    designer: "Design: DaKES Institute",
    distance: "Distance",
    mass: "Mass",
    radius: "Radius",
    habitableScore: "Habitability Score",
    discovery: "Discovered",
    sources: "Grounding Sources",
    noResults: "No habitable planets found for this star. Try another!",
    loading: "Stargazing...",
    loadingStep1: "Scanning deep space frequencies...",
    loadingStep2: "Synthesizing planetary data...",
    recentDiscoveries: "Key Discoveries"
  },
  zh: {
    title: "Exoplanet",
    subtitle: "宜居行星集汇",
    searchPlaceholder: "输入恒星名称 (如 TRAPPIST-1, 比邻星)...",
    searchBtn: "探索",
    credits: "DaKES Institute 设计制作",
    author: "作者：Fred Y. Ye (叶鹰)",
    designer: "设计：DaKES Institute",
    distance: "距离",
    mass: "质量",
    radius: "半径",
    habitableScore: "宜居指数",
    discovery: "发现年份",
    sources: "数据来源",
    noResults: "未找到该恒星的宜居行星。请尝试搜索其他恒星！",
    loading: "正在数星星...",
    loadingStep1: "正在扫描深空频段...",
    loadingStep2: "正在合成行星档案...",
    recentDiscoveries: "最新发现行星"
  }
};

export const ADVANCED_TRANSLATIONS: Record<'en' | 'zh', any> = {
  en: {
    advanced: "Advanced Filters",
    minMass: "Min Mass (M⊕)",
    maxMass: "Max Mass (M⊕)",
    maxDistance: "Max Distance (LY)",
    earthLikeOnly: "Earth-like Only",
    starType: "Star Spectral Type",
    reset: "Reset Filters",
    loadingStages: [
      "Calibrating telescope focus...",
      "Searching astronomical archives...",
      "Analyzing orbital trajectories...",
      "Generating planetary visuals...",
      "Finalizing celestial map..."
    ]
  },
  zh: {
    advanced: "高级筛选",
    minMass: "最小质量 (M⊕)",
    maxMass: "最大质量 (M⊕)",
    maxDistance: "最大距离 (光年)",
    earthLikeOnly: "仅限类地行星",
    starType: "恒星光谱类型",
    reset: "重置筛选",
    loadingStages: [
      "校准望远镜焦距...",
      "检索天文档案...",
      "分析轨道运行轨迹...",
      "合成行星视觉图像...",
      "完成星图绘制..."
    ]
  }
};

export const INITIAL_PLANETS: any[] = [
  {
    name: "Proxima Centauri b",
    hostStar: "Proxima Centauri",
    distanceLy: 4.2,
    discoveryYear: 2016,
    massEarths: 1.07,
    radiusEarths: 1.03,
    habitabilityScore: 85,
    description: "The closest known exoplanet to our solar system, orbiting in the habitable zone of a red dwarf.",
    isConfirmed: true
  },
  {
    name: "TRAPPIST-1 e",
    hostStar: "TRAPPIST-1",
    distanceLy: 39.5,
    discoveryYear: 2017,
    massEarths: 0.69,
    radiusEarths: 0.91,
    habitabilityScore: 92,
    description: "An Earth-sized planet in the middle of the habitable zone, likely rocky and potentially holding water.",
    isConfirmed: true
  }
];

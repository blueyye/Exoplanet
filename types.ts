
export interface Exoplanet {
  name: string;
  hostStar: string;
  distanceLy: number;
  discoveryYear: number;
  massEarths: number;
  radiusEarths: number;
  habitabilityScore: number; // 0-100
  description: string;
  imageUrl?: string;
  isConfirmed: boolean;
}

export interface StarSystemData {
  starName: string;
  starType: string;
  planets: Exoplanet[];
  summary: string;
  sources: { title: string; uri: string }[];
  starImageUrl?: string;
}

export type Language = 'en' | 'zh';

export interface Translations {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  searchBtn: string;
  credits: string;
  author: string;
  designer: string;
  distance: string;
  mass: string;
  radius: string;
  habitableScore: string;
  discovery: string;
  sources: string;
  noResults: string;
  loading: string;
  loadingStep1: string;
  loadingStep2: string;
  recentDiscoveries: string;
}

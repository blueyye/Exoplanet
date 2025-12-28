
import { GoogleGenAI, Type } from "@google/genai";
import { StarSystemData, Exoplanet } from "../types";

export interface SearchFilters {
  minMass?: number;
  maxMass?: number;
  maxDistance?: number;
  earthLikeOnly?: boolean;
  starType?: string;
}

export const getExoplanetData = async (query: string, lang: 'en' | 'zh', filters?: SearchFilters): Promise<StarSystemData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const filterContext = filters ? `
    Apply these specific filters if possible:
    - Minimum Mass: ${filters.minMass || 'Any'} M⊕
    - Maximum Mass: ${filters.maxMass || 'Any'} M⊕
    - Maximum Distance: ${filters.maxDistance || 'Any'} Light Years
    - Only Earth-like planets: ${filters.earthLikeOnly ? 'Yes' : 'No'}
    - Target Star Type: ${filters.starType === 'any' ? 'Any' : filters.starType}
  ` : '';

  const systemPrompt = `You are a professional astronomer. Search for exoplanet data for the star: "${query}". 
  Provide accurate details for any known potentially HABITABLE planets orbiting this star. 
  ${filterContext}
  If the query is a specific planet, provide details for that planet and its system.
  Include planetary mass, radius, distance from Earth (light years), discovery year, and a short description.
  
  IMPORTANT: You must provide a "summary" field. 
  The summary should be an evocative, scientifically grounded, and concise one-to-two sentence overview of the star system's most remarkable feature (e.g., its similarity to our Sun, the stability of its habitable zone, or its unique orbital resonance).
  
  IMPORTANT: Return the response strictly as a JSON object matching the following structure:
  {
    "starName": "Name",
    "starType": "Spectral Class (e.g. G2V, M1V)",
    "summary": "Evocative scientific summary of the system here",
    "planets": [
      {
        "name": "Planet Name",
        "hostStar": "Star Name",
        "distanceLy": number,
        "discoveryYear": number,
        "massEarths": number,
        "radiusEarths": number,
        "habitabilityScore": number (0-100),
        "description": "Short bio",
        "isConfirmed": boolean
      }
    ]
  }`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: systemPrompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
    },
  });

  const rawText = response.text || "{}";
  const data = JSON.parse(rawText) as StarSystemData;
  
  // Attach grounding sources
  data.sources = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
    .filter((chunk: any) => chunk.web)
    .map((chunk: any) => ({
      title: chunk.web.title,
      uri: chunk.web.uri
    }));

  return data;
};

export const generateStarImage = async (starName: string, starType: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const prompt = `A breathtaking, scientifically accurate astronomical visualization of the star "${starName}". 
  Spectral type: ${starType}. 
  Visual features: Intense solar flares, glowing corona, textured surface with convection cells, 
  background of a dense star field. If it's an M-dwarf, it should look deep red/orange. 
  If it's a G-type star, it should look bright yellow-white. High contrast, 4K space photography style.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: prompt }]
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  
  return "";
};

export const generatePlanetImage = async (planetName: string, description: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const prompt = `A highly detailed, cinematic artist's impression of the exoplanet ${planetName}. 
  Description context: ${description}. 
  Style: Realistic space photography, NASA-inspired, 4k resolution, epic scale, starry background.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: prompt }]
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9"
      }
    }
  });

  let imageUrl = "";
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      break;
    }
  }
  
  return imageUrl || `https://picsum.photos/seed/${planetName}/800/450`;
};

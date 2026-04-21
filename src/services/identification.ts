import { fetchWikipediaData } from "./externalData";

export interface StarProfile {
  name: string;
  profession: string;
  bio: string;
  age: number;
  birthDate: string;
  netWorth: string;
  careerHighlights: string[];
  notableWorks: { title: string; year: string; type: 'movie' | 'song' | 'other' }[];
  funFacts: string[];
  socialMedia: {
    instagram?: string;
    twitter?: string;
    website?: string;
  };
  recentNews: string[];
  similarCelebrities: { name: string; reason: string }[];
  source?: string;
  thumbnail?: string;
}

/**
 * Fetches celebrity data solely from Wikipedia using the name provided by the user.
 * This is 100% free and requires no API keys.
 */
export async function identificationByName(name: string): Promise<StarProfile | null> {
  try {
    const wikiData = await fetchWikipediaData(name);
    
    if (!wikiData) return null;

    return {
      name: wikiData.title,
      profession: wikiData.description || "Public Figure",
      bio: wikiData.extract,
      age: 0,
      birthDate: "See Biography",
      netWorth: "Registry Data Restricted",
      careerHighlights: ["Profile verified via Wikipedia Registry"],
      notableWorks: [],
      funFacts: ["Data sourced from open-source encyclopedia"],
      socialMedia: {
        website: `https://en.wikipedia.org/wiki/${encodeURIComponent(wikiData.title)}`
      },
      recentNews: [],
      similarCelebrities: [],
      source: "Wikipedia",
      thumbnail: wikiData.thumbnail
    };
  } catch (error) {
    console.error("Wikipedia Sync Error:", error);
    return null;
  }
}

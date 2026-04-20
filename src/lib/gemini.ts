import { GoogleGenAI, Type } from "@google/genai";
import { fetchWikipediaData } from "../services/externalData";

let genAI: GoogleGenAI | null = null;
// ... (rest of the initial setup remains the same)
const GEMINI_API_KEY = "AIzaSyDIWXRMcMN1-iUPNIImPD_UbwYOntrVBa8";

function getAI() {
  if (!genAI) {
    const key = GEMINI_API_KEY;
    if (!key) {
      throw new Error("Target identification module offline: GEMINI_API_KEY omitted.");
    }
    genAI = new GoogleGenAI({ apiKey: key });
  }
  return genAI;
}

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
}

export async function identifyCelebrity(base64Image: string, mimeType: string): Promise<StarProfile | null> {
  try {
    const ai = getAI();
    let response;
    
    try {
      response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [
              {
                inlineData: {
                  data: base64Image,
                  mimeType,
                },
              },
              {
                text: "Act as a world-class celebrity identification expert. Identify the person in the image. Provide a comprehensive profile in JSON. Crucially, find their verified Instagram/Twitter handles and current estimated net worth. If identified, return the full name correctly so I can fetch their Wikipedia bio.",
              },
            ],
          },
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              profession: { type: Type.STRING },
              bio: { type: Type.STRING },
              age: { type: Type.NUMBER },
              birthDate: { type: Type.STRING },
              netWorth: { type: Type.STRING },
              careerHighlights: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              notableWorks: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    year: { type: Type.STRING },
                    type: { type: Type.STRING, enum: ['movie', 'song', 'other'] },
                  },
                },
              },
              funFacts: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              socialMedia: {
                type: Type.OBJECT,
                properties: {
                  instagram: { type: Type.STRING },
                  twitter: { type: Type.STRING },
                  website: { type: Type.STRING },
                },
              },
              recentNews: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              similarCelebrities: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    reason: { type: Type.STRING },
                  },
                },
              },
            },
            required: ["name", "profession", "bio", "age", "birthDate", "netWorth", "careerHighlights", "notableWorks", "funFacts", "recentNews", "similarCelebrities"],
          },
        },
      });
    } catch (apiErr: any) {
      if (apiErr.message?.includes('API_KEY')) {
        throw new Error("API Key configuration error. Please check your settings.");
      }
      if (apiErr.message?.includes('quota')) {
        throw new Error("AI Scan limit exceeded. Please try again later.");
      }
      throw new Error("AI Target Recognition failed. Connection interrupted.");
    }

    if (!response.text) throw new Error("Target identification failed. No data returned.");
    
    let profile: StarProfile;
    try {
      profile = JSON.parse(response.text) as StarProfile;
    } catch (e) {
      throw new Error("Data parsing error. Target metadata corrupted.");
    }

    if (!profile.name || profile.name === 'Unknown') {
      return null; // Handle this case specifically in App.tsx
    }

    // Enhancement: Fetch real Wikipedia data
    const wikiData = await fetchWikipediaData(profile.name);
    if (wikiData && wikiData.extract) {
      profile.bio = wikiData.extract;
      profile.source = "Wikipedia";
      if (wikiData.description && !profile.profession) {
        profile.profession = wikiData.description;
      }
    }

    return profile;
  } catch (error: any) {
    console.error("Error identifying celebrity:", error);
    throw error;
  }
}

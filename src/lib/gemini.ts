import { GoogleGenAI, Type } from "@google/genai";
import { fetchWikipediaData } from "../services/externalData";

let genAI: GoogleGenAI | null = null;
// ... (rest of the initial setup remains the same)
const GEMINI_API_KEY = "AIzaSyDIWXRMcMN1-iUPNIImPD_UbwYOntrVBa8";

function getAI() {
  if (!genAI) {
    const key = GEMINI_API_KEY;
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
        model: "gemini-1.5-flash-latest",
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
                text: "Analyze the image and identify the celebrity. Return a JSON profile. Focus on getting the correct full name so I can fetch their Wikipedia data. Also include their occupation, age, birth date, estimated net worth, top career highlights, notable works, 3 fun facts, and verified social media handles (Instagram/Twitter).",
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
    if (wikiData) {
      if (wikiData.extract && wikiData.extract.length > 50) {
        profile.bio = wikiData.extract;
        profile.source = "Wikipedia";
      }
      if (wikiData.description) {
        profile.profession = wikiData.description;
      }
      // Normalize name to Wikipedia title if possible
      if (wikiData.title) {
        profile.name = wikiData.title;
      }
    }

    return profile;
  } catch (error: any) {
    console.error("Error identifying celebrity:", error);
    throw error;
  }
}

import { GoogleGenAI, Type } from "@google/genai";

let genAI: GoogleGenAI | null = null;

function getAI() {
  if (!genAI) {
    const key = process.env.GEMINI_API_KEY;
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
}

export async function identifyCelebrity(base64Image: string, mimeType: string): Promise<StarProfile | null> {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
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
              text: "IDENTIFY target in photo. respond in JSON. BE CONCISE. include: net worth, age, birthDate, top works (year included), fun facts, recent news, 3 similar celebs. if no star found, return null fields.",
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

    if (!response.text) return null;
    return JSON.parse(response.text) as StarProfile;
  } catch (error) {
    console.error("Error identifying celebrity:", error);
    return null;
  }
}

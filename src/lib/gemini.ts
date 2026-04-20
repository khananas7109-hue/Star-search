import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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
              text: "Identify the celebrity or influencer in this photo and provide their comprehensive profile details. If no famous person is found, return an error or null equivalent within the schema. Include: net worth, age, birthdate, notable works (movies/songs) with years, fun facts, recent news, and 3-4 similar celebrities with a reason for the comparison.",
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

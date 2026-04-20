/**
 * Service to fetch real data from Wikipedia and other public sources.
 */

export interface WikipediaData {
  extract: string;
  thumbnail?: string;
  description?: string;
  birthDate?: string;
  birthPlace?: string;
}

export async function fetchWikipediaData(name: string): Promise<WikipediaData | null> {
  try {
    // We use the Summary endpoint for basic info
    const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name.replace(/\s+/g, '_'))}`);
    if (!response.ok) return null;
    
    const data = await response.json();
    return {
      extract: data.extract,
      thumbnail: data.thumbnail?.source,
      description: data.description,
    };
  } catch (error) {
    console.error("Wikipedia API error:", error);
    return null;
  }
}

export async function fetchEnhancedCelebrityData(name: string) {
  // We can use Wikipedia for bio and general info
  const wiki = await fetchWikipediaData(name);
  
  // Note: For real-time data like net worth and news, 
  // in a real production app we'd use Serper or Google Custom Search.
  // Since we are in the applet, we will use the results from AI but 
  // priority goes to Wiki for the bio.

  return {
    wiki,
  };
}

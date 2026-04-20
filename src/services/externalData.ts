/**
 * Service to fetch real data from Wikipedia and other public sources.
 */

export interface WikipediaData {
  extract: string;
  thumbnail?: string;
  description?: string;
  title: string;
  displaytitle: string;
}

export async function fetchWikipediaData(name: string): Promise<WikipediaData | null> {
  try {
    // Try primary search first to handle name variations
    const searchResponse = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(name)}&format=json&origin=*`);
    const searchData = await searchResponse.json();
    
    let targetTitle = name;
    if (searchData.query?.search?.length > 0) {
      targetTitle = searchData.query.search[0].title;
    }

    // Use the Summary endpoint for basic info with the corrected title
    const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(targetTitle.replace(/\s+/g, '_'))}`);
    if (!response.ok) return null;
    
    const data = await response.json();
    return {
      extract: data.extract,
      thumbnail: data.thumbnail?.source,
      description: data.description,
      title: data.title,
      displaytitle: data.displaytitle
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

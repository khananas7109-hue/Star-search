/**
 * Service to fetch real data from Wikipedia and other public sources.
 */

export interface WikipediaData {
  extract: string;
  thumbnail?: string;
  description?: string;
  title: string;
  displaytitle: string;
  related?: any[];
  fullText?: string;
}

export async function fetchWikipediaData(name: string): Promise<WikipediaData | null> {
  try {
    // 1. Search for the most relevant page title
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(name)}&format=json&origin=*&srlimit=1`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();
    
    if (!searchData.query?.search || searchData.query.search.length === 0) {
      return null;
    }

    const targetTitle = searchData.query.search[0].title;

    // 2. Fetch Summary and Thumbnail using Action API (CORS friendly with origin=*)
    // prop=extracts (sentences) + prop=pageimages (thumbnail)
    const summaryUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages|description&exintro&explaintext&redirects=1&titles=${encodeURIComponent(targetTitle)}&format=json&origin=*&pithumbsize=500`;
    const summaryRes = await fetch(summaryUrl);
    const summaryData = await summaryRes.json();
    
    const pages = summaryData.query?.pages;
    if (!pages) return null;
    
    const pageId = Object.keys(pages)[0];
    if (pageId === "-1") return null;
    
    const page = pages[pageId];

    // 3. Fetch Related (using Action API search with category/related logic fallback)
    // Wikipedia REST API related is sometimes blocked, we'll search for pages with similar titles or categories
    const relatedUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=morelike:${encodeURIComponent(targetTitle)}&format=json&origin=*&srlimit=4`;
    const relatedRes = await fetch(relatedUrl);
    const relatedSearchData = await relatedRes.json();
    const relatedPages = (relatedSearchData.query?.search || []).map((p: any) => ({
      title: p.title,
      description: "Related Personality"
    }));

    // 4. Fetch Full Text (already using Action API)
    const fullTextRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&titles=${encodeURIComponent(targetTitle)}&explaintext=1&format=json&origin=*&redirects=1`);
    const fullTextData = await fullTextRes.json();
    const fullPages = fullTextData.query?.pages;
    const fullPageId = fullPages ? Object.keys(fullPages)[0] : null;
    const fullText = fullPageId && fullPageId !== "-1" ? fullPages[fullPageId].extract : "";

    return {
      extract: page.extract || "",
      thumbnail: page.thumbnail?.source,
      description: page.description,
      title: page.title,
      displaytitle: page.title,
      related: relatedPages,
      fullText: fullText
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

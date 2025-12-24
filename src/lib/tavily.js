
/**
 * Search using Tavily AI API
 * @param {string} query - Search query
 * @param {object} config - Search configuration from SourcePanel
 * @param {string} config.searchDepth - 'basic' or 'advanced'
 * @param {string} config.searchTopic - 'general', 'news', or 'research'
 * @param {boolean} config.includeImages - Whether to include images
 * @param {boolean} config.includeAnswer - Whether to include AI answer
 */
export const searchTavily = async (query, config = {}) => {
    const apiKey = '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';
    const url = 'https://api.tavily.com/search';

    // Apply configuration with defaults
    const {
        searchDepth = 'basic',
        searchTopic = 'general',
        maxResults = 8,
        includeImages = false,
        includeAnswer = true
    } = config;

    // Tavily only supports 'general' and 'news' as topics
    const validTopic = searchTopic === 'research' ? 'general' : searchTopic;

    const body = {
        api_key: apiKey,
        query: query,
        search_depth: searchDepth,
        include_answer: includeAnswer,
        include_images: includeImages,
        max_results: Math.min(maxResults, 10), // Tavily free tier/dev keys often limit max_results
        topic: validTopic
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`Tavily API error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Tavily search failed:", error);
        return null;
    }
};



export const searchTavily = async (query) => {
    const apiKey = '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';
    const url = 'https://api.tavily.com/search';

    const body = {
        api_key: apiKey,
        query: query,
        search_depth: "basic",
        include_answer: true,
        max_results: 5,
        topic: "general"
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

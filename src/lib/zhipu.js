
export const generateInsights = async (query, searchResults) => {
    const apiKey = '7e010d05d6904046a63664776185b561.Uf8Eoq68707K94pw';
    const url = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

    // Construct a context string from search results
    const context = searchResults.map(r => `- ${r.title}: ${r.content}`).join('\n');

    const prompt = `
    You are Tentacle AI, an advanced learning assistant.
    User Query: "${query}"
    Search Context:
    ${context}

    Tasks:
    1. Summarize 3 Key Insights (max 50 words each).
    2. Provide a concise, conversational answer for the "Knowledge Ink" panel.

    Output specifically in this JSON format:
    {
        "key_insights": ["Insight 1", "Insight 2", "Insight 3"],
        "answer": "Conversational answer here..."
    }
    `;

    const body = {
        model: "glm-4.6",
        messages: [
            { role: "system", content: "You are a helpful AI assistant that outputs JSON." },
            { role: "user", content: prompt }
        ],
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 1024,
        json: true // Assuming the API supports JSON mode or we parse text
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`Zhipu API error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        // Parse JSON content (handling potential markdown code blocks)
        let parsed = null;
        try {
            const cleanContent = content.replace(/```json\n?|\n?```/g, '');
            parsed = JSON.parse(cleanContent);
        } catch (e) {
            console.error("Failed to parse JSON from Zhipu:", e);
            // Fallback if not JSON
            parsed = {
                key_insights: ["Analysis complete.", "Data complex.", "Review sources."],
                answer: content
            };
        }

        return parsed;

    } catch (error) {
        console.error("Zhipu generation failed:", error);
        return null;
    }
};

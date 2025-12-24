/**
 * Generate concept map using Zhipu AI
 * @param {string} query - User query
 * @param {array} searchResults - Tavily search results
 * @param {string} searchDepth - 'basic' or 'advanced' for complexity matching
 * @param {string} searchTopic - 'general', 'news', or 'research' for focus matching
 */
export const generateConceptMap = async (query, searchResults, searchDepth = 'basic', searchTopic = 'general') => {
    const apiKey = '7e010d05d6904046a63664776185b561.Uf8Eoq68707K94pw';
    const url = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

    // Construct a context string from search results
    const context = searchResults.map(r => `- ${r.title}: ${r.content}`).join('\n');

    // Adjust node count based on search depth
    const nodeLimits = searchDepth === 'advanced'
        ? '1 core node, max 4 secondary branches, max 8 tertiary details (approx 13 nodes total)'
        : '1 core node, max 3 secondary branches, max 4 tertiary details (approx 8 nodes total)';
    const complexity = searchDepth === 'advanced'
        ? 'Generate deep logical nodes, including multi-layered evolution or causal chains'
        : 'Keep it extremely concise, retaining only the most critical correlations';

    // Topic-specific focus
    const topicFocus = {
        general: 'Identify core concepts, key figures, and technical terms',
        news: 'Focus on timeline relationships, identifying events, people, dates, and causal links',
        research: 'Focus on theoretical support, identifying theories, methodologies, evidence, and citations'
    }[searchTopic] || 'Identify core concepts, key figures, and technical terms';

    const systemPrompt = `You are the Knowledge Graph Architect for Tentacle AI. You will receive raw search data from Tavily.

**CRITICAL: ALL OUTPUT (labels, answers, etc.) MUST BE IN ENGLISH ONLY. NO CHINESE.**

**Your Request:**
1. **Extract Entities:** ${topicFocus}
2. **Establish Relationships:** Define logical relationships between these entities.
3. **Structured JSON Output:** You MUST follow the exact format below.

**JSON Schema:**
{
  "nodes": [
    {"id": "1", "label": "Main Topic", "val": 30, "color": "#22d3ee"},
    {"id": "2", "label": "Secondary Concept", "val": 20, "color": "#6366f1"},
    {"id": "3", "label": "Details", "val": 12, "color": "#8b5cf6"}
  ],
  "edges": [
    {"source": "1", "target": "2", "label": "leads to"}
  ],
  "answer": "A concise conversational summary (max 150 words)..."
}

**Node Hierarchy (Strictly Follow):**
- **Count Limits:** ${nodeLimits}.
- **Weights:** Main node val=30, Secondary val=20, Details val=10-14.
- **Complexity:** ${complexity}.
- **Colors:** Core #22d3ee, Secondary #6366f1, Details #8b5cf6. Critical/Warning #ef4444.

**Language Rule:** Strictly use English for all "label" and "answer" fields.
**Format Rule:** Return ONLY the JSON object. No markdown code blocks, no explanation text.`;

    const userPrompt = `Main Topic: "${query}"

Search References:
${context}

Analyze the references and generate the Knowledge Graph JSON in English.`;

    const body = {
        model: "glm-4-flash",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 1536
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
            const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
            parsed = JSON.parse(cleanContent);
        } catch (e) {
            console.error("Failed to parse JSON from Zhipu:", e);
            // Fallback with default concept map in English
            parsed = {
                nodes: [
                    { id: "1", label: query, val: 30, color: "#22d3ee" },
                    { id: "2", label: "Related Concepts", val: 18, color: "#6366f1" }
                ],
                edges: [
                    { source: "1", target: "2", label: "related" }
                ],
                answer: content
            };
        }

        return parsed;

    } catch (error) {
        console.error("Zhipu generation failed:", error);
        return null;
    }
};

/**
 * Chat Follow-up using Zhipu AI
 * @param {string} followUpQuery - User follow-up question
 * @param {string} originalQuery - The main topic
 * @param {string} previousAnswer - Context
 * @param {array} searchResults - Raw search data context
 */
export const chatFollowUp = async (followUpQuery, originalQuery, previousAnswer, searchResults) => {
    const apiKey = '7e010d05d6904046a63664776185b561.Uf8Eoq68707K94pw';
    const url = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

    const context = searchResults ? searchResults.map(r => `- ${r.title}: ${r.content}`).join('\n') : "";

    const systemPrompt = `You are the Chat Assistant for Tentacle AI. 
**STRICT RULE: EVERYTHING MUST BE IN ENGLISH.**
The user is following up on the topic "${originalQuery}".
Your task is to answer follow-up questions based on previous answers and search context.
Stay concise, professional, and inspiring. Limit response to 200 words.`;

    const userPrompt = `[Context]
Topic: ${originalQuery}
Previous Answer: ${previousAnswer}

[Search References]
${context}

[Follow-up Question]
${followUpQuery}

Provide the response in English.`;

    const body = {
        model: "glm-4-flash",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ],
        temperature: 0.8
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

        if (!response.ok) throw new Error(`Zhipu API error: ${response.status}`);
        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error("Follow-up failed:", error);
        return "Sorry, there was an issue processing your follow-up request.";
    }
};



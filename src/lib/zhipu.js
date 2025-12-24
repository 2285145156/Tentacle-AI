
/**
 * Generate concept map using Zhipu AI
 * @param {string} query - User query
 * @param {array} searchResults - Tavily search results
 * @param {string} searchDepth - 'basic' or 'advanced' for complexity matching
 */
export const generateConceptMap = async (query, searchResults, searchDepth = 'basic') => {
    const apiKey = '7e010d05d6904046a63664776185b561.Uf8Eoq68707K94pw';
    const url = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

    // Construct a context string from search results
    const context = searchResults.map(r => `- ${r.title}: ${r.content}`).join('\n');

    // Adjust node count based on search depth
    const nodeCount = searchDepth === 'advanced' ? '8-12' : '5-8';
    const complexity = searchDepth === 'advanced' ? '生成更深层的逻辑节点，包含多层次的概念关系' : '保持简洁，突出核心概念';

    const systemPrompt = `你是 Tentacle AI 的核心大脑。你的任务是将搜索结果转化为一个复杂的神经连接概念图。

**当前搜索深度：** ${searchDepth === 'advanced' ? 'Advanced (深度分析)' : 'Basic (快速总结)'}

**输入：** 用户的课题 + 联网搜索到的原始文本
**输出要求：** 必须仅输出一个标准的 JSON 对象，包含 nodes（节点）、edges（连线）和 answer（回答）。

**JSON 格式规范：**
{
  "nodes": [
    {"id": "1", "label": "核心课题", "size": 24, "color": "#22d3ee"},
    {"id": "2", "label": "子概念1", "size": 18, "color": "#6366f1"},
    {"id": "3", "label": "子概念2", "size": 16, "color": "#8b5cf6"}
  ],
  "edges": [
    {"source": "1", "target": "2", "label": "关联"},
    {"source": "1", "target": "3", "label": "包含"}
  ],
  "answer": "简洁的对话式回答，不超过150字..."
}

**节点规范：**
- 控制在 ${nodeCount} 个节点
- ${complexity}
- 核心概念 size=24，颜色 #22d3ee (青色)
- 次级概念 size=16-20，颜色 #6366f1 (靛蓝) 或 #8b5cf6 (紫色)
- 警告/重要节点可用 #ef4444 (红色)

**约束：** 不要包含任何解释性文字，只输出 JSON。`;

    const userPrompt = `用户课题: "${query}"

搜索资料:
${context}

请分析以上资料，生成概念图 JSON。`;

    const body = {
        model: "glm-4-flash",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 1024
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
            // Fallback with default concept map
            parsed = {
                nodes: [
                    { id: "1", label: query, size: 24, color: "#22d3ee" },
                    { id: "2", label: "相关概念", size: 16, color: "#6366f1" }
                ],
                edges: [
                    { source: "1", target: "2", label: "关联" }
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


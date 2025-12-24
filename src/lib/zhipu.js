
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
        ? '核心词 1 个，二级分支不超过 4 个，三级分支不超过 8 个 (总计约 13 个)'
        : '核心词 1 个，二级分支不超过 3 个，三级分支不超过 4 个 (总计约 8 个)';
    const complexity = searchDepth === 'advanced' ? '生成深层逻辑节点，包含多层次的概念演化或因果链' : '保持极度简洁，仅保留最关键的关联性';

    // Topic-specific focus
    const topicFocus = {
        general: '识别核心概念、关键人物、技术术语',
        news: '侧重时间线关系，识别事件、人物、时间节点、因果链',
        research: '侧重理论支撑关系，识别理论、方法论、证据、引用来源'
    }[searchTopic] || '识别核心概念、关键人物、技术术语'; // Fallback for topicFocus.general

    const systemPrompt = `你是 Tentacle AI 的知识图谱架构师。你将接收来自 Tavily 的搜索原始数据。

**当前配置：**
- 搜索深度：${searchDepth === 'advanced' ? 'Advanced (深度分析)' : 'Basic (快速总结)'}
- 搜索领域：${searchTopic === 'news' ? 'News (新闻热点)' : searchTopic === 'research' ? 'Research (学术研究)' : 'General (全网)'}

**你的任务：**
1. **提取实体：** ${topicFocus}
2. **建立关联：** 定义这些实体之间的逻辑关系。
3. **输出结构化 JSON：** 必须严格遵循以下格式。

**JSON 格式规范：**
{
  "nodes": [
    {"id": "1", "label": "核心课题", "val": 30, "color": "#22d3ee"},
    {"id": "2", "label": "二级概念", "val": 20, "color": "#6366f1"},
    {"id": "3", "label": "三级细节", "val": 12, "color": "#8b5cf6"}
  ],
  "edges": [
    {"source": "1", "target": "2", "label": "关联"}
  ],
  "answer": "简洁的对话式回答..."
}

**节点层级规范（严格遵守）：**
- **数量限制：** ${nodeLimits}。
- **权重设置：** 核心词 val=30，二级分支 val=20，三级分支/细节 val=10-14。
- ${complexity}
- 颜色：核心 #22d3ee，次级 #6366f1，细节 #8b5cf6。重要/警告节点 #ef4444。

**回复规范：** 仅返回 JSON 代码块。`;

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


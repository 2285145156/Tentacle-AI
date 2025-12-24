import React, { useState, useRef } from 'react';
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { SourcePanel } from './components/SourcePanel';
import { CentralBrain } from './components/CentralBrain';
import { KnowledgePanel } from './components/KnowledgePanel';
import { searchTavily } from './lib/tavily';
import { generateConceptMap, chatFollowUp } from './lib/zhipu';

function App() {
  const [searchResults, setSearchResults] = useState(null);
  const [chatHistory, setChatHistory] = useState([]); // Array of { query, answer }
  const [conceptMap, setConceptMap] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isFollowUpLoading, setIsFollowUpLoading] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");

  // Store search config from SourcePanel
  const searchConfigRef = useRef({
    searchDepth: 'basic',
    searchTopic: 'general',
    maxResults: 8,
    includeImages: false,
    includeAnswer: true
  });

  const handleConfigChange = (config) => {
    searchConfigRef.current = config;
  };

  const handleSearch = async (query) => {
    if (!query.trim()) return;

    setIsSearching(true);
    setCurrentQuery(query);
    setSearchResults(null);
    setChatHistory([]); // Clear history on new main search
    setConceptMap(null);

    const config = searchConfigRef.current;

    // 1. Search Tavily with user configuration
    const searchData = await searchTavily(query, config);

    if (searchData && searchData.results) {
      setSearchResults(searchData.results);

      // 2. Process with Zhipu AI - Generate Concept Map
      const zhipuData = await generateConceptMap(query, searchData.results, config.searchDepth, config.searchTopic);

      if (zhipuData) {
        setConceptMap({ nodes: zhipuData.nodes, edges: zhipuData.edges });
        const initialAnswer = (config.includeAnswer && searchData.answer) ? searchData.answer : zhipuData.answer;
        setChatHistory([{ query, answer: initialAnswer }]);
      } else {
        setChatHistory([{ query, answer: searchData.answer || "Analysis failed." }]);
      }
    } else {
      setChatHistory([{ query, answer: "No results found in the cosmos." }]);
    }

    setIsSearching(false);
  };

  const handleFollowUp = async (followUpQuery) => {
    if (!followUpQuery.trim() || !currentQuery) return;

    setIsFollowUpLoading(true);

    // Use the last answer as context
    const previousAnswer = chatHistory.length > 0 ? chatHistory[chatHistory.length - 1].answer : "";

    // Call chat specialized follow-up
    const answer = await chatFollowUp(
      followUpQuery,
      currentQuery,
      previousAnswer,
      searchResults
    );

    if (answer) {
      setChatHistory(prev => [...prev, { query: followUpQuery, answer }]);
    }

    setIsFollowUpLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30">
      <Layout>
        <Header onSearch={handleSearch} isSearching={isSearching} />
        <main className="flex-1 grid grid-cols-5 gap-6 p-6 h-full overflow-hidden">
          <SourcePanel onConfigChange={handleConfigChange} />
          <CentralBrain conceptMap={conceptMap} isSearching={isSearching} />
          <KnowledgePanel
            history={chatHistory}
            isSearching={isSearching || isFollowUpLoading}
            onSearch={handleFollowUp}
          />
        </main>
      </Layout>
    </div>
  );
}


export default App;





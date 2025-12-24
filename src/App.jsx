import React, { useState, useRef } from 'react';
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { SourcePanel } from './components/SourcePanel';
import { CentralBrain } from './components/CentralBrain';
import { KnowledgePanel } from './components/KnowledgePanel';
import { searchTavily } from './lib/tavily';
import { generateConceptMap } from './lib/zhipu';

function App() {
  const [searchResults, setSearchResults] = useState(null);
  const [aiAnswer, setAiAnswer] = useState(null);
  const [conceptMap, setConceptMap] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");

  // Store search config from SourcePanel
  const searchConfigRef = useRef({
    searchDepth: 'basic',
    searchTopic: 'general',
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
    setAiAnswer(null);
    setConceptMap(null);

    const config = searchConfigRef.current;

    // 1. Search Tavily with user configuration
    const searchData = await searchTavily(query, config);

    if (searchData && searchData.results) {
      setSearchResults(searchData.results);

      // 2. Process with Zhipu AI - Generate Concept Map
      // Pass search depth and topic to Zhipu for intelligent matching
      const zhipuData = await generateConceptMap(query, searchData.results, config.searchDepth, config.searchTopic);

      if (zhipuData) {
        setConceptMap({ nodes: zhipuData.nodes, edges: zhipuData.edges });
        // Prefer Tavily's answer if available and includeAnswer is true
        if (config.includeAnswer && searchData.answer) {
          setAiAnswer(searchData.answer);
        } else {
          setAiAnswer(zhipuData.answer);
        }
      } else {
        // Fallback to Tavily answer if Zhipu fails
        setAiAnswer(searchData.answer || "Analysis failed.");
      }
    } else {
      setAiAnswer("No results found in the cosmos.");
    }

    setIsSearching(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30">
      <Layout>
        <Header onSearch={handleSearch} isSearching={isSearching} />
        <main className="flex-1 grid grid-cols-5 gap-6 p-6 h-full overflow-hidden">
          <SourcePanel onConfigChange={handleConfigChange} />
          <CentralBrain conceptMap={conceptMap} isSearching={isSearching} />
          <KnowledgePanel answer={aiAnswer} isSearching={isSearching} query={currentQuery} />
        </main>
      </Layout>
    </div>
  );
}

export default App;



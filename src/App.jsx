import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { SourcePanel } from './components/SourcePanel';
import { CentralBrain } from './components/CentralBrain';
import { KnowledgePanel } from './components/KnowledgePanel';
import { searchTavily } from './lib/tavily';
import { generateInsights } from './lib/zhipu';

function App() {
  const [searchResults, setSearchResults] = useState(null);
  const [aiAnswer, setAiAnswer] = useState(null);
  const [keyInsights, setKeyInsights] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");

  const handleSearch = async (query) => {
    if (!query.trim()) return;

    setIsSearching(true);
    setCurrentQuery(query);
    setSearchResults(null);
    setAiAnswer(null);
    setKeyInsights(null);

    // 1. Search Tavily
    const searchData = await searchTavily(query);

    if (searchData && searchData.results) {
      setSearchResults(searchData.results);

      // 2. Process with Zhipu AI
      const zhipuData = await generateInsights(query, searchData.results);

      if (zhipuData) {
        setKeyInsights(zhipuData.key_insights);
        setAiAnswer(zhipuData.answer);
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
          <SourcePanel sources={searchResults} isSearching={isSearching} />
          <CentralBrain insights={keyInsights} isSearching={isSearching} />
          <KnowledgePanel answer={aiAnswer} isSearching={isSearching} query={currentQuery} />
        </main>
      </Layout>
    </div>
  );
}

export default App;

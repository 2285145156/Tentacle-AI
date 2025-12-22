import React from 'react';
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { SourcePanel } from './components/SourcePanel';
import { CentralBrain } from './components/CentralBrain';
import { KnowledgePanel } from './components/KnowledgePanel';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30">
      <Layout>
        <Header />
        <main className="flex-1 grid grid-cols-5 gap-6 p-6 h-[calc(100vh-80px)] overflow-hidden">
          <SourcePanel />
          <CentralBrain />
          <KnowledgePanel />
        </main>
      </Layout>
    </div>
  );
}

export default App;

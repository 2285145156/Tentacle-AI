import React, { useEffect, useState, useRef } from 'react';
import { Brain, Sparkles } from 'lucide-react';
import mermaid from 'mermaid';

export function CentralBrain({ insights, isSearching }) {
    // Typewriter effect state
    const [displayedInsights, setDisplayedInsights] = useState([]);

    useEffect(() => {
        if (insights && insights.length > 0) {
            setDisplayedInsights([]);
            let currentInsightIndex = 0;

            const showNextInsight = () => {
                if (currentInsightIndex < insights.length) {
                    setDisplayedInsights(prev => {
                        // Avoid duplicates if effect runs multiple times quickly
                        if (prev.length > currentInsightIndex) return prev;
                        return [...prev, insights[currentInsightIndex]];
                    });
                    currentInsightIndex++;
                    setTimeout(showNextInsight, 1500); // Delay between lines
                }
            };

            showNextInsight();
        } else {
            setDisplayedInsights([]);
        }
    }, [insights]);

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            theme: 'base',
            themeVariables: {
                darkMode: true,
                background: '#020617',
                mainBkg: '#0f172a',
                primaryColor: '#22d3ee',
                primaryTextColor: '#cbd5e1',
                lineColor: '#6366f1',
            },
            fontFamily: 'Inter',
        });

        const graphDefinition = `
        graph TD
          A[Black Holes] --> B(Event Horizon)
          A --> C(Singularity)
          B --> D[Light cannot escape]
          
          classDef cyan fill:#0f172a,stroke:#22d3ee,stroke-width:2px,color:#fff
          classDef indigo fill:#0f172a,stroke:#6366f1,stroke-width:2px,color:#fff
          classDef red fill:#000000,stroke:#ef4444,stroke-width:2px,color:#fca5a5
          
          class A cyan
          class B,C indigo
          class D red
          
          linkStyle default stroke:#475569,stroke-width:1px
        // The explicit renderMermaid function is no longer needed if startOnLoad is true
        // and the graph is defined directly in the JSX with class="mermaid"
        // If you still want to dynamically render into mermaidRef.current, you'd keep this
        // and adjust the JSX accordingly. For this change, we'll rely on startOnLoad.

        // If you want to keep the dynamic rendering into mermaidRef.current for the background:
        // const graphDefinition = `
        // graph TD
        //   A[Black Holes] --> B(Event Horizon)
        //   A --> C(Singularity)
        //   B --> D[Light cannot escape]

        //   classDef cyan fill:#0f172a,stroke:#22d3ee,stroke-width:2px,color:#fff
        //   classDef indigo fill:#0f172a,stroke:#6366f1,stroke-width:2px,color:#fff
        //   classDef red fill:#000000,stroke:#ef4444,stroke-width:2px,color:#fca5a5

        //   class A cyan
        //   class B,C indigo
        //   class D red

        //   linkStyle default stroke:#475569,stroke-width:1px
        // `;

        // const renderMermaid = async () => {
        //     if (mermaidRef.current) {
        //         try {
        //             mermaidRef.current.innerHTML = '';
        //             const { svg } = await mermaid.render('mermaid-svg', graphDefinition);
        //             mermaidRef.current.innerHTML = svg;
        //         } catch (error) {
        //             console.error("Mermaid render error:", error);
        //         }
        //     }
        // };
        // renderMermaid();

        // For the new inline mermaid block, mermaid.init() will handle it if startOnLoad is true.
        // We can explicitly call it if needed, but usually not necessary with startOnLoad.
        mermaid.init(undefined, '.mermaid');

    }, []);

    return (
        <div className="glass-panel rounded-none border-x-0 border-t-0 border-b-0 md:rounded-2xl md:border flex flex-col h-full col-span-3 relative overflow-hidden">
            {/* Background Graph Layer */}
            <div className="absolute inset-0 opacity-20">
                <div className="mermaid w-full h-full flex items-center justify-center">
                    {`
                    graph TD
                    A[Start] --> B(Concept)
                    B --> C{Decision}
                    C -->|Yes| D[Result 1]
                    C -->|No| E[Result 2]
                    style A fill:#0f172a,stroke:#22d3ee,stroke-width:2px
                    style B fill:#0f172a,stroke:#22d3ee,stroke-width:2px
                    style C fill:#0f172a,stroke:#22d3ee,stroke-width:2px
                    style D fill:#0f172a,stroke:#22d3ee,stroke-width:2px
                    style E fill:#0f172a,stroke:#22d3ee,stroke-width:2px
                    `}
                </div>
            </div>

            {/* Header */}
            <div className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-slate-900/50 z-10">
                <h2 className="text-sm font-semibold tracking-wider text-slate-400 uppercase">Central Brain</h2>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                    <span className="text-xs text-cyan-400 font-mono">NEURAL NET: ACTIVE</span>
                </div>
            </div>

            {/* Content Layer */}
            <div className="flex-1 relative z-20 p-8 flex flex-col items-center justify-center">

                {isSearching ? (
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                        <span className="text-cyan-400 font-mono tracking-widest text-lg animate-pulse">ANALYZING DATA STREAMS...</span>
                    </div>
                ) : insights ? (
                    <div className="w-full max-w-2xl space-y-6">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="text-cyan-400">❖</span> KEY INSIGHTS
                        </h3>
                        <div className="space-y-4">
                            {displayedInsights.map((insight, idx) => (
                                <div key={idx} className="flex gap-4 animate-in fade-in slide-in-from-left duration-700">
                                    <span className="text-cyan-500 font-mono text-lg">0{idx + 1}</span>
                                    <p className="text-lg text-slate-200 leading-relaxed border-l-2 border-cyan-500/30 pl-4">
                                        {insight}
                                    </p>
                                </div>
                            ))}
                            {displayedInsights.length < insights.length && displayedInsights.length > 0 && (
                                <span className="inline-block w-2 h-6 bg-cyan-500 animate-ping ml-1" />
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-600 tracking-tight">
                            TENTACLE <span className="text-cyan-500">AI</span>
                        </h1>
                        <p className="text-slate-400 max-w-md mx-auto text-lg">
                            Connect your curiosity to the cosmos. Search to begin the neural link.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

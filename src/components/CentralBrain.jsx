import React, { useEffect, useState, useRef } from 'react';
import { Brain, Sparkles } from 'lucide-react';
import mermaid from 'mermaid';

export function CentralBrain() {
    const [text, setText] = useState('');
    const fullText = "The concept of 'Deep Learning' mimics the human brain structure...";
    const mermaidRef = useRef(null);

    useEffect(() => {
        let index = 0;
        const timer = setInterval(() => {
            setText(fullText.slice(0, index));
            index++;
            if (index > fullText.length) clearInterval(timer);
        }, 50);
        return () => clearInterval(timer);
    }, []);

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
      `;

        const renderMermaid = async () => {
            if (mermaidRef.current) {
                try {
                    mermaidRef.current.innerHTML = '';
                    const { svg } = await mermaid.render('mermaid-svg', graphDefinition);
                    mermaidRef.current.innerHTML = svg;
                } catch (error) {
                    console.error("Mermaid render error:", error);
                }
            }
        };

        renderMermaid();
    }, []);

    return (
        <div className="col-span-3 flex flex-col gap-6 h-full">
            {/* Upper: Concept Map Placeholder */}
            <div className="glass-panel flex-1 rounded-3xl p-6 relative overflow-hidden group flex flex-col">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950" />

                <div className="relative z-10 flex flex-col items-center h-full w-full">
                    <h3 className="text-xs font-mono text-slate-500 mb-2 tracking-[0.2em] uppercase shrink-0">Core Concept Map</h3>

                    <div className="flex-1 w-full flex items-center justify-center overflow-hidden" ref={mermaidRef}>
                        {/* Mermaid Diagram injected here */}
                    </div>
                </div>
            </div>

            {/* Bottom: Insights Summary */}
            <div className="h-1/3 glass-panel rounded-3xl p-6 border-l-4 border-l-indigo-500">
                <h3 className="flex items-center gap-2 text-indigo-400 font-semibold mb-3">
                    <Sparkles size={18} />
                    Key Insights
                </h3>
                <p className="text-slate-300 leading-relaxed font-light">
                    {text}
                    <span className="animate-pulse text-indigo-400">|</span>
                </p>
            </div>
        </div>
    );
}

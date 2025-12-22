import React, { useEffect, useState } from 'react';
import { Brain, Sparkles } from 'lucide-react';

export function CentralBrain() {
    const [text, setText] = useState('');
    const fullText = "The concept of 'Deep Learning' mimics the human brain structure...";

    useEffect(() => {
        let index = 0;
        const timer = setInterval(() => {
            setText(fullText.slice(0, index));
            index++;
            if (index > fullText.length) clearInterval(timer);
        }, 50);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="col-span-3 flex flex-col gap-6 h-full">
            {/* Upper: Concept Map Placeholder */}
            <div className="glass-panel flex-1 rounded-3xl p-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950" />

                <div className="relative z-10 flex flex-col items-center justify-center h-full">
                    <h3 className="text-xs font-mono text-slate-500 mb-6 tracking-[0.2em] uppercase">Core Concept Map</h3>

                    <Brain size={64} className="text-cyan-500 mb-4 animate-pulse duration-[3000ms]" />

                    {/* Network Visualization */}
                    <div className="absolute inset-0 z-0">
                        <svg width="100%" height="100%" className="opacity-40">
                            <defs>
                                <filter id="glow">
                                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                                    <feMerge>
                                        <feMergeNode in="coloredBlur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>
                            {/* Center Node */}
                            <circle cx="50%" cy="40%" r="40" stroke="#22d3ee" strokeWidth="2" fill="none" filter="url(#glow)" className="animate-pulse" />
                            <circle cx="50%" cy="40%" r="20" fill="#22d3ee" fillOpacity="0.2" />

                            {/* Connections */}
                            <line x1="50%" y1="40%" x2="30%" y2="60%" stroke="#6366f1" strokeWidth="1" />
                            <line x1="50%" y1="40%" x2="70%" y2="60%" stroke="#6366f1" strokeWidth="1" />
                            <line x1="50%" y1="40%" x2="50%" y2="70%" stroke="#6366f1" strokeWidth="1" />

                            {/* Child Nodes */}
                            <circle cx="30%" cy="60%" r="15" stroke="#6366f1" strokeWidth="2" fill="#0f172a" />
                            <circle cx="70%" cy="60%" r="15" stroke="#6366f1" strokeWidth="2" fill="#0f172a" />
                            <circle cx="50%" cy="70%" r="15" stroke="#6366f1" strokeWidth="2" fill="#0f172a" />
                        </svg>
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

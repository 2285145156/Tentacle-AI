import React from 'react';
import { Send } from 'lucide-react';

export function KnowledgePanel() {


    return (
        <div className="glass-panel rounded-none border-x-0 border-t-0 border-b-0 md:rounded-2xl md:border flex flex-col h-full col-span-1 overflow-hidden">
            {/* Header */}
            <div className="h-14 border-b border-white/10 flex items-center px-4 bg-slate-900/50">
                <h2 className="text-sm font-semibold tracking-wider text-slate-400 uppercase">Knowledge Ink</h2>
            </div>

            {/* Top: Chat Interface */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                <div className="absolute top-2 left-0 w-full text-center">
                    <span className="text-[10px] text-slate-600 uppercase tracking-widest">AI Assistant</span>
                </div>

                <div className="flex-1 p-4 overflow-y-auto space-y-4 text-sm pt-8">
                    <div className="bg-slate-800/50 p-3 rounded-lg rounded-tl-none border border-white/5 text-slate-300">
                        How does the event horizon work?
                    </div>
                    <div className="bg-cyan-900/10 p-3 rounded-lg border-l-2 border-cyan-500 text-slate-400 font-mono text-xs">
                        [Brain]: The event horizon is the boundary defining the region of space around a black hole from which nothing (not even light) can escape.
                    </div>
                </div>

                {/* Input Area */}
                <div className="p-3 border-t border-white/5 bg-slate-950/30">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Ask follow-up..."
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50"
                        />
                        <button className="absolute right-2 top-1.5 text-cyan-500 hover:text-cyan-400">
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            </div>




        </div>
    );
}

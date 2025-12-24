import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';

export function KnowledgePanel({ history = [], isSearching, onSearch }) {
    const [followUp, setFollowUp] = useState('');
    const chatEndRef = useRef(null);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history, isSearching]);

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        if (!followUp.trim() || isSearching) return;
        onSearch(followUp);
        setFollowUp('');
    };

    return (
        <div className="glass-panel rounded-none border-x-0 border-t-0 border-b-0 md:rounded-2xl md:border flex flex-col h-full col-span-1 overflow-hidden relative">
            {/* Header */}
            <div className="h-14 border-b border-white/10 flex items-center px-4 bg-slate-900/50">
                <Sparkles size={16} className="text-cyan-400 mr-2" />
                <h2 className="text-sm font-semibold tracking-wider text-slate-400 uppercase">Knowledge Ink</h2>
            </div>

            {/* Chat Interface */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 p-4 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
                    {history.length > 0 ? (
                        <>
                            {history.map((item, index) => (
                                <div key={index} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    {/* User Query */}
                                    <div className="flex justify-end">
                                        <div className="max-w-[85%] bg-slate-800 border border-white/5 p-3 rounded-2xl rounded-tr-none text-slate-200 text-xs shadow-xl">
                                            {item.query}
                                        </div>
                                    </div>

                                    {/* AI Response */}
                                    <div className="flex justify-start">
                                        <div className="max-w-[90%] bg-cyan-950/20 border-l-2 border-cyan-500/50 p-4 rounded-r-xl text-slate-400 font-mono text-xs leading-relaxed shadow-inner">
                                            <span className="text-cyan-400 font-bold mb-2 block uppercase text-[10px] tracking-widest">
                                                [{index === 0 ? 'Primary Analysis' : `Follow-up ${index}`}]
                                            </span>
                                            {item.answer}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </>
                    ) : isSearching ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="flex flex-col items-center gap-3">
                                <Loader2 className="w-6 h-6 text-cyan-500 animate-spin" />
                                <span className="text-cyan-500/60 font-mono text-[10px] uppercase tracking-widest">Generating Insight...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-3 opacity-30 select-none">
                            <div className="w-12 h-12 rounded-full border border-dashed border-slate-700 flex items-center justify-center">
                                <Sparkles size={20} className="text-slate-700" />
                            </div>
                            <div className="text-slate-500 text-xs font-mono uppercase tracking-widest">
                                Awaiting Command
                            </div>
                        </div>
                    )}

                    {/* Loading indicator for follow-up */}
                    {isSearching && history.length > 0 && (
                        <div className="flex justify-start animate-pulse">
                            <div className="bg-cyan-950/10 border-l-2 border-cyan-800 p-3 rounded-r-xl text-[10px] font-mono text-cyan-700 uppercase tracking-widest">
                                Thinking...
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <form
                    onSubmit={handleSubmit}
                    className="p-4 border-t border-white/5 bg-slate-950/40 relative z-10"
                >
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
                        <input
                            type="text"
                            value={followUp}
                            onChange={(e) => setFollowUp(e.target.value)}
                            disabled={isSearching}
                            placeholder={isSearching ? "Octopus is thinking..." : "Ask the Deep..."}
                            className="relative w-full bg-slate-900 border border-slate-700/50 rounded-xl pl-4 pr-12 py-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-600 disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={!followUp.trim() || isSearching}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-cyan-500 hover:bg-cyan-500/10 disabled:text-slate-800 transition-all"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}



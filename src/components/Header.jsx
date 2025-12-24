import React, { useRef } from 'react';
import { Search, Zap, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

export function Header({ onSearch, isSearching }) {
    const inputRef = useRef(null);

    const handleSearchClick = () => {
        if (inputRef.current) {
            onSearch(inputRef.current.value);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onSearch(e.currentTarget.value);
        }
    };

    return (
        <header className="h-20 px-6 flex items-center justify-between border-b border-white/5 bg-slate-950/50 backdrop-blur-sm z-50">
            {/* Logo Area */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                    <Zap className="text-white w-6 h-6" fill="currentColor" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">
                    Tentacle <span className="text-cyan-400">AI</span>
                </span>
            </div>

            {/* Central Search */}
            <div className="flex-1 max-w-2xl mx-12">
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full opacity-20 group-hover:opacity-30 blur transition-opacity" />
                    <div className="relative flex items-center bg-slate-900/80 border border-white/10 rounded-full overflow-hidden shadow-2xl">
                        <Search className="ml-4 w-5 h-5 text-slate-400" />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search the cosmos..."
                            className="w-full bg-transparent border-none focus:ring-0 focus:outline-none appearance-none text-slate-200 placeholder-slate-500 px-4 py-3 font-medium shadow-none outline-none ring-0 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden [&::-webkit-search-results-button]:hidden [&::-webkit-search-results-decoration]:hidden"
                            style={{
                                boxShadow: 'none',
                                border: 'none',
                                outline: 'none',
                                caretColor: '#22d3ee'
                            }}
                            onKeyDown={handleKeyDown}
                        />
                        <button
                            onClick={handleSearchClick}
                            disabled={isSearching}
                            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isSearching ? <Loader2 className="animate-spin w-4 h-4" /> : "GO"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Controls (Placeholder) */}
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center">
                    <span className="text-xs font-medium text-slate-400">USR</span>
                </div>
            </div>
        </header>
    );
}

import React, { useState, useEffect } from 'react';
import {
    Zap,
    Microscope,
    Globe,
    Newspaper,
    GraduationCap,
    Image,
    MessageSquare,
    Settings2,
    Sparkles,
    Brain
} from 'lucide-react';
import { cn } from '../lib/utils';

export function SourcePanel({ onConfigChange }) {
    // Search Depth: basic or advanced
    const [searchDepth, setSearchDepth] = useState('basic');

    // Search Domain/Topic: general, news, or research
    const [searchTopic, setSearchTopic] = useState('general');

    // Advanced toggles
    const [includeImages, setIncludeImages] = useState(false);
    const [includeAnswer, setIncludeAnswer] = useState(true);

    // Notify parent of config changes
    useEffect(() => {
        if (onConfigChange) {
            onConfigChange({
                searchDepth,
                searchTopic,
                includeImages,
                includeAnswer
            });
        }
    }, [searchDepth, searchTopic, includeImages, includeAnswer, onConfigChange]);

    // Calculate active "arms" for status display
    const getActiveArms = () => {
        let count = 2; // base
        if (searchDepth === 'advanced') count += 2; // 4
        if (searchTopic === 'news') count += 1;     // 5
        if (searchTopic === 'research') count += 2; // 6
        if (includeImages) count += 1;              // 7
        if (includeAnswer) count += 1;              // 8
        return Math.min(count, 8);
    };

    return (
        <div className="glass-panel rounded-none border-x-0 border-t-0 border-b-0 md:rounded-2xl md:border flex flex-col h-full col-span-1 overflow-hidden relative">
            {/* Header */}
            <div className="h-14 border-b border-white/10 flex items-center px-4 bg-slate-900/50">
                <Settings2 size={16} className="text-cyan-400 mr-2" />
                <h2 className="text-sm font-semibold tracking-wider text-slate-400 uppercase">Search Config</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Intelligence Level */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-300">
                        <Brain size={16} className="text-cyan-400" />
                        <span className="text-sm font-medium">Intelligence Level</span>
                    </div>
                    <div className="space-y-2 ml-6">
                        <button
                            onClick={() => setSearchDepth('basic')}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
                                searchDepth === 'basic'
                                    ? "bg-cyan-500/20 border border-cyan-500/50 text-cyan-100"
                                    : "bg-slate-800/50 border border-white/5 text-slate-400 hover:bg-slate-800"
                            )}
                        >
                            <Zap size={16} className={searchDepth === 'basic' ? "text-cyan-400" : "text-slate-500"} />
                            <div className="text-left">
                                <div className="text-sm font-medium">Basic</div>
                                <div className="text-xs text-slate-500">Fast, simple facts</div>
                            </div>
                        </button>
                        <button
                            onClick={() => setSearchDepth('advanced')}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
                                searchDepth === 'advanced'
                                    ? "bg-indigo-500/20 border border-indigo-500/50 text-indigo-100"
                                    : "bg-slate-800/50 border border-white/5 text-slate-400 hover:bg-slate-800"
                            )}
                        >
                            <Microscope size={16} className={searchDepth === 'advanced' ? "text-indigo-400" : "text-slate-500"} />
                            <div className="text-left">
                                <div className="text-sm font-medium">Advanced</div>
                                <div className="text-xs text-slate-500">Deep reasoning</div>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Search Domain */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-300">
                        <Globe size={16} className="text-cyan-400" />
                        <span className="text-sm font-medium">Search Domain</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 ml-6">
                        {[
                            { id: 'general', label: 'General', icon: Globe },
                            { id: 'news', label: 'News', icon: Newspaper },
                            { id: 'research', label: 'Research', icon: GraduationCap },
                        ].map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => setSearchTopic(id)}
                                className={cn(
                                    "flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all text-xs",
                                    searchTopic === id
                                        ? "bg-cyan-500/20 border border-cyan-500/50 text-cyan-100"
                                        : "bg-slate-800/50 border border-white/5 text-slate-400 hover:bg-slate-800"
                                )}
                            >
                                <Icon size={16} className={searchTopic === id ? "text-cyan-400" : "text-slate-500"} />
                                <span>{label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search Filters */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-300">
                        <Sparkles size={16} className="text-cyan-400" />
                        <span className="text-sm font-medium">Search Filters</span>
                    </div>
                    <div className="space-y-2 ml-6">
                        {/* Include Images Toggle */}
                        <button
                            onClick={() => setIncludeImages(!includeImages)}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/50 border border-white/5 hover:bg-slate-800 transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <Image size={16} className={includeImages ? "text-cyan-400" : "text-slate-500"} />
                                <span className={cn("text-sm", includeImages ? "text-cyan-100" : "text-slate-400")}>
                                    Include Images
                                </span>
                            </div>
                            <div className={cn(
                                "w-10 h-5 rounded-full transition-all relative",
                                includeImages ? "bg-cyan-500" : "bg-slate-600"
                            )}>
                                <div className={cn(
                                    "absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all",
                                    includeImages ? "left-5" : "left-0.5"
                                )} />
                            </div>
                        </button>

                        {/* Include Answer Toggle */}
                        <button
                            onClick={() => setIncludeAnswer(!includeAnswer)}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/50 border border-white/5 hover:bg-slate-800 transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <MessageSquare size={16} className={includeAnswer ? "text-cyan-400" : "text-slate-500"} />
                                <span className={cn("text-sm", includeAnswer ? "text-cyan-100" : "text-slate-400")}>
                                    Include AI Answer
                                </span>
                            </div>
                            <div className={cn(
                                "w-10 h-5 rounded-full transition-all relative",
                                includeAnswer ? "bg-cyan-500" : "bg-slate-600"
                            )}>
                                <div className={cn(
                                    "absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all",
                                    includeAnswer ? "left-5" : "left-0.5"
                                )} />
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Status Bar */}
            <div className="p-4 border-t border-white/10 bg-slate-900/30">
                <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-slate-500">Tentacle Status</span>
                    <span className="text-cyan-400 font-mono">{getActiveArms()}/8 arms active</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${(getActiveArms() / 8) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
}

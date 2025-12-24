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
    Radar,
    Waves,
    Activity
} from 'lucide-react';
import { cn } from '../lib/utils';

export function SourcePanel({ onConfigChange }) {
    // Search Depth: basic or advanced
    const [searchDepth, setSearchDepth] = useState('basic');

    // Search Domain/Topic: general, news, or research
    const [searchTopic, setSearchTopic] = useState('general');

    // Tentacle Reach (max_results): 5-20
    const [tentacleReach, setTentacleReach] = useState(8);

    // Advanced toggles
    const [includeImages, setIncludeImages] = useState(false);
    const [includeAnswer, setIncludeAnswer] = useState(true);

    // Notify parent of config changes
    useEffect(() => {
        if (onConfigChange) {
            onConfigChange({
                searchDepth,
                searchTopic,
                maxResults: tentacleReach,
                includeImages,
                includeAnswer
            });
        }
    }, [searchDepth, searchTopic, tentacleReach, includeImages, includeAnswer, onConfigChange]);

    // Calculate active "arms" based on all settings
    const getActiveArms = () => {
        let count = Math.floor(tentacleReach / 5) + 1; // 5->2, 10->3, 15->4, 20->5
        if (searchDepth === 'advanced') count += 1;
        if (searchTopic === 'research') count += 1;
        if (includeImages && includeAnswer) count += 1;
        else if (includeImages || includeAnswer) count += 0.5;

        return Math.min(8, Math.ceil(count));
    };

    return (
        <div className="glass-panel rounded-none border-x-0 border-t-0 border-b-0 md:rounded-2xl md:border flex flex-col h-full col-span-1 overflow-hidden relative">
            {/* Animated background pulse */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500 rounded-full blur-3xl animate-pulse" />
            </div>

            {/* Header */}
            <div className="h-14 border-b border-white/10 flex items-center justify-between px-4 bg-slate-900/50 relative z-10">
                <div className="flex items-center gap-2">
                    <Radar size={16} className="text-cyan-400 animate-pulse" />
                    <h2 className="text-sm font-semibold tracking-wider text-slate-400 uppercase">Command</h2>
                </div>
                <div className="flex items-center gap-1">
                    <Activity size={12} className="text-green-400" />
                    <span className="text-[10px] text-green-400 font-mono">ONLINE</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-5 relative z-10">
                {/* Intelligence Level - Segmented Control */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-300">
                        <Zap size={14} className="text-cyan-400" />
                        <span className="text-xs font-medium uppercase tracking-wider">Intelligence</span>
                    </div>
                    <div className="bg-slate-800/80 rounded-lg p-1 flex gap-1">
                        <button
                            onClick={() => setSearchDepth('basic')}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-all text-xs font-medium",
                                searchDepth === 'basic'
                                    ? "bg-cyan-500/20 text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.3)]"
                                    : "text-slate-500 hover:text-slate-300"
                            )}
                        >
                            <Zap size={12} />
                            Basic
                        </button>
                        <button
                            onClick={() => setSearchDepth('advanced')}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-all text-xs font-medium",
                                searchDepth === 'advanced'
                                    ? "bg-indigo-500/20 text-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.3)]"
                                    : "text-slate-500 hover:text-slate-300"
                            )}
                        >
                            <Microscope size={12} />
                            Advanced
                        </button>
                    </div>
                </div>

                {/* Search Domain - Icon Cards */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-300">
                        <Globe size={14} className="text-cyan-400" />
                        <span className="text-xs font-medium uppercase tracking-wider">Focus</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { id: 'general', label: 'General', icon: Globe },
                            { id: 'news', label: 'News', icon: Newspaper },
                            { id: 'research', label: 'Research', icon: GraduationCap },
                        ].map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => setSearchTopic(id)}
                                className={cn(
                                    "flex flex-col items-center gap-1 p-2 rounded-lg transition-all border",
                                    searchTopic === id
                                        ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                                        : "bg-slate-800/50 border-transparent text-slate-500 hover:border-slate-600"
                                )}
                            >
                                <Icon size={18} className={searchTopic === id ? "text-cyan-400" : ""} />
                                <span className="text-[10px] font-medium">{label}</span>
                            </button>
                        ))}

                    </div>
                </div>

                {/* Tentacle Reach - Slider */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-300">
                            <Waves size={14} className="text-cyan-400" />
                            <span className="text-xs font-medium uppercase tracking-wider">Tentacle Reach</span>
                        </div>
                        <span className="text-cyan-400 font-mono text-sm font-bold">{tentacleReach}</span>
                    </div>
                    <div className="relative">
                        <input
                            type="range"
                            min="5"
                            max="20"
                            value={tentacleReach}
                            onChange={(e) => setTentacleReach(parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer
                                [&::-webkit-slider-thumb]:appearance-none
                                [&::-webkit-slider-thumb]:w-4
                                [&::-webkit-slider-thumb]:h-4
                                [&::-webkit-slider-thumb]:rounded-full
                                [&::-webkit-slider-thumb]:bg-cyan-400
                                [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(34,211,238,0.6)]
                                [&::-webkit-slider-thumb]:cursor-pointer
                                [&::-webkit-slider-thumb]:transition-all
                                [&::-webkit-slider-thumb]:hover:scale-110"
                        />
                        {/* Glow track */}
                        <div
                            className="absolute top-0 left-0 h-2 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full pointer-events-none opacity-60"
                            style={{ width: `${((tentacleReach - 5) / 15) * 100}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-600 px-1">
                        <span>Shallow</span>
                        <span>Deep</span>
                    </div>
                </div>

                {/* Data Extraction - Glowing Switches */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-300">
                        <Settings2 size={14} className="text-cyan-400" />
                        <span className="text-xs font-medium uppercase tracking-wider">Extraction</span>
                    </div>
                    <div className="space-y-2">
                        {/* Include Images Toggle */}
                        <button
                            onClick={() => setIncludeImages(!includeImages)}
                            className={cn(
                                "w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all border",
                                includeImages
                                    ? "bg-cyan-500/10 border-cyan-500/30"
                                    : "bg-slate-800/50 border-transparent hover:border-slate-700"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                                    includeImages ? "bg-cyan-500/20" : "bg-slate-700/50"
                                )}>
                                    <Image size={16} className={includeImages ? "text-cyan-400" : "text-slate-500"} />
                                </div>
                                <div className="text-left">
                                    <div className={cn("text-xs font-medium", includeImages ? "text-cyan-100" : "text-slate-400")}>
                                        Visual Capture
                                    </div>
                                    <div className="text-[10px] text-slate-600">Extract images</div>
                                </div>
                            </div>
                            <div className={cn(
                                "w-10 h-5 rounded-full transition-all relative",
                                includeImages ? "bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]" : "bg-slate-600"
                            )}>
                                <div className={cn(
                                    "absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-md",
                                    includeImages ? "left-5" : "left-0.5"
                                )} />
                            </div>
                        </button>

                        {/* Include Answer Toggle */}
                        <button
                            onClick={() => setIncludeAnswer(!includeAnswer)}
                            className={cn(
                                "w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all border",
                                includeAnswer
                                    ? "bg-cyan-500/10 border-cyan-500/30"
                                    : "bg-slate-800/50 border-transparent hover:border-slate-700"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                                    includeAnswer ? "bg-cyan-500/20" : "bg-slate-700/50"
                                )}>
                                    <MessageSquare size={16} className={includeAnswer ? "text-cyan-400" : "text-slate-500"} />
                                </div>
                                <div className="text-left">
                                    <div className={cn("text-xs font-medium", includeAnswer ? "text-cyan-100" : "text-slate-400")}>
                                        Pre-Digest
                                    </div>
                                    <div className="text-[10px] text-slate-600">AI summary</div>
                                </div>
                            </div>
                            <div className={cn(
                                "w-10 h-5 rounded-full transition-all relative",
                                includeAnswer ? "bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]" : "bg-slate-600"
                            )}>
                                <div className={cn(
                                    "absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-md",
                                    includeAnswer ? "left-5" : "left-0.5"
                                )} />
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Status Bar */}
            <div className="p-4 border-t border-white/10 bg-slate-900/50 relative z-10">
                <div className="flex items-center justify-between text-xs mb-2">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                        <span className="text-slate-500 font-mono">SYSTEM</span>
                    </div>
                    <span className="text-cyan-400 font-mono font-bold">{getActiveArms()}/8 ARMS</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-700"
                        style={{ width: `${(getActiveArms() / 8) * 100}%` }}
                    />
                </div>
                <div className="mt-2 text-[10px] text-slate-600 text-center font-mono">
                    {searchDepth === 'advanced' ? '⚡ DEEP SCAN MODE' : '🔍 QUICK SCAN MODE'}
                </div>
            </div>
        </div>
    );
}

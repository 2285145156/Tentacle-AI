import React, { useState } from 'react';
import { Globe, Book, Youtube, FileText, CheckCircle2, Circle, Folder, File, Podcast, AlignLeft } from 'lucide-react';
import { cn } from '../lib/utils';

export function SourcePanel({ sources, isSearching }) {
    // Default mock data when no search results
    const defaultWebSources = [
        { id: 'wiki', label: 'Wikipedia', checked: true },
        { id: 'arxiv', label: 'ArXiv Papers', checked: true },
        { id: 'reddit', label: 'Reddit', checked: false },
    ];

    // Multimedia remains static for now
    const multimediaSources = [
        { id: 'yt', label: 'YouTube', checked: true },
        { id: 'pod', label: 'Podcasts', checked: false },
    ];

    const webItems = sources
        ? sources.map((s, i) => ({ id: s.url, label: s.title, checked: true, url: s.url }))
        : defaultWebSources;

    const groups = [
        {
            title: 'Web Search',
            icon: Globe,
            color: 'text-cyan-400',
            items: webItems
        },
        {
            title: 'Multimedia',
            icon: Youtube,
            color: 'text-red-500',
            items: multimediaSources
        }
    ];

    return (
        <div className="glass-panel rounded-none border-x-0 border-t-0 border-b-0 md:rounded-2xl md:border flex flex-col h-full col-span-1 overflow-hidden relative">
            {/* Header */}
            <div className="h-14 border-b border-white/10 flex items-center px-4 bg-slate-900/50">
                <h2 className="text-sm font-semibold tracking-wider text-slate-400 uppercase">Source Tentacles</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {isSearching ? (
                    <div className="flex flex-col items-center justify-center h-40 space-y-4">
                        <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin"></div>
                        <p className="text-cyan-500 text-sm animate-pulse">Scanning the cosmos...</p>
                    </div>
                ) : (
                    groups.map((group) => (
                        <div key={group.title} className="space-y-3">
                            <div className="flex items-center gap-2 text-slate-300">
                                <group.icon size={16} className={group.color} />
                                <span className="text-sm font-medium">{group.title}</span>
                            </div>
                            <div className="pl-2 space-y-2 border-l border-white/5 ml-2">
                                {group.items.map(item => (
                                    <div
                                        key={item.id}
                                        onClick={() => item.url ? window.open(item.url, '_blank') : null}
                                        className={cn("group flex items-center gap-3 pl-4 py-1.5 rounded-r-lg transition-colors", item.url ? "cursor-pointer hover:bg-white/5" : "cursor-default")}
                                    >
                                        <div className={cn("w-4 h-4 border rounded flex items-center justify-center transition-colors", item.checked ? "bg-cyan-500/20 border-cyan-500 text-cyan-500" : "border-slate-600 text-transparent")}>
                                            <CheckCircle2 size={12} className={item.checked ? "opacity-100" : "opacity-0"} />
                                        </div>
                                        <span className={cn("text-sm transition-colors truncate pr-2", item.checked ? "text-cyan-100" : "text-slate-500")}>
                                            {item.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

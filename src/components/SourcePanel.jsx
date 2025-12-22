import React from 'react';
import { Globe, Book, Youtube, FileText, CheckCircle2, Circle, Folder, File, Podcast, AlignLeft } from 'lucide-react';
import { cn } from '../lib/utils';

export function SourcePanel() {
    const groups = [
        {
            title: 'Web Search',
            icon: Globe,
            color: 'text-cyan-400',
            items: [
                { id: 'wiki', label: 'Wikipedia', checked: true },
                { id: 'arxiv', label: 'ArXiv Papers', checked: true },
                { id: 'reddit', label: 'Reddit', checked: false },
            ]
        },
        {
            title: 'Multimedia',
            icon: Youtube,
            color: 'text-red-500',
            items: [
                { id: 'yt', label: 'YouTube', checked: true },
                { id: 'pod', label: 'Podcasts', checked: false },
            ]
        },

    ];

    return (
        <div className="glass-panel rounded-none border-x-0 border-t-0 border-b-0 md:rounded-2xl md:border flex flex-col h-full col-span-1 overflow-hidden relative">
            {/* Header */}
            <div className="h-14 border-b border-white/10 flex items-center px-4 bg-slate-900/50">
                <h2 className="text-sm font-semibold tracking-wider text-slate-400 uppercase">Source Tentacles</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {groups.map((group) => (
                    <div key={group.title} className="space-y-3">
                        <div className="flex items-center gap-2 text-slate-300">
                            <group.icon size={16} className={group.color} />
                            <span className="text-sm font-medium">{group.title}</span>
                        </div>
                        <div className="pl-2 space-y-2 border-l border-white/5 ml-2">
                            {group.items.map(item => (
                                <div key={item.id} className="group flex items-center gap-3 pl-4 cursor-pointer hover:bg-white/5 py-1.5 rounded-r-lg transition-colors">
                                    <div className={cn("w-4 h-4 border rounded flex items-center justify-center transition-colors", item.checked ? "bg-cyan-500/20 border-cyan-500 text-cyan-500" : "border-slate-600 text-transparent")}>
                                        <CheckCircle2 size={12} className={item.checked ? "opacity-100" : "opacity-0"} />
                                    </div>
                                    <span className={cn("text-sm", item.checked ? "text-cyan-100" : "text-slate-500 group-hover:text-slate-400")}>{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Status */}
            <div className="h-12 border-t border-white/10 bg-slate-950 flex items-center px-4 justify-between text-xs font-mono text-slate-500">
                <span>Status: 4 arms active...</span>
                <span className="text-cyan-500">[|||||||||| 85%]</span>
            </div>
        </div>
    );
}

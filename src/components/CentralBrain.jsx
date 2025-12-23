import React from 'react';
import { Brain, Zap, AlertTriangle } from 'lucide-react';
import { ConceptGraph } from './ConceptGraph';

// Error Boundary to catch ConceptGraph crashes
class GraphErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ConceptGraph error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center space-y-4 p-8">
                        <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto" />
                        <div className="text-yellow-400 text-lg font-mono">RENDER ERROR</div>
                        <p className="text-slate-400 max-w-md">
                            The concept map encountered an error. Please try another search.
                        </p>
                        <button
                            onClick={() => this.setState({ hasError: false, error: null })}
                            className="px-4 py-2 bg-cyan-500/20 border border-cyan-500 rounded-lg text-cyan-400 hover:bg-cyan-500/30 transition"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export function CentralBrain({ conceptMap, isSearching }) {
    return (
        <div className="glass-panel rounded-none border-x-0 border-t-0 border-b-0 md:rounded-2xl md:border flex flex-col h-full col-span-3 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-500 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-indigo-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            {/* Header */}
            <div className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-slate-900/50 z-10">
                <h2 className="text-sm font-semibold tracking-wider text-slate-400 uppercase">Central Brain</h2>
                <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isSearching ? 'bg-yellow-500' : conceptMap ? 'bg-green-500' : 'bg-cyan-500'} animate-pulse`} />
                    <span className="text-xs text-cyan-400 font-mono">
                        {isSearching ? 'PROCESSING...' : conceptMap ? 'NEURAL MAP: ACTIVE' : 'NEURAL NET: STANDBY'}
                    </span>
                </div>
            </div>

            {/* Content Layer */}
            <div className="flex-1 relative z-20 flex flex-col items-center justify-center overflow-hidden">
                {/* Stage: Searching */}
                {isSearching && (
                    <div className="flex flex-col items-center gap-6 animate-fade-in">
                        {/* Neural Network Loading Animation */}
                        <div className="relative w-32 h-32">
                            {/* Central node */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_30px_rgba(34,211,238,0.6)]" />

                            {/* Orbiting nodes */}
                            {[0, 1, 2, 3, 4, 5].map((i) => (
                                <div
                                    key={i}
                                    className="absolute w-4 h-4 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.6)]"
                                    style={{
                                        top: `${50 + 40 * Math.sin((i * Math.PI * 2) / 6 + Date.now() / 1000)}%`,
                                        left: `${50 + 40 * Math.cos((i * Math.PI * 2) / 6 + Date.now() / 1000)}%`,
                                        transform: 'translate(-50%, -50%)',
                                        animation: `orbit-${i} 3s linear infinite`,
                                    }}
                                />
                            ))}

                            {/* Connecting lines animation */}
                            <svg className="absolute inset-0 w-full h-full animate-spin-slow" style={{ animationDuration: '8s' }}>
                                {[0, 1, 2, 3, 4, 5].map((i) => (
                                    <line
                                        key={i}
                                        x1="50%"
                                        y1="50%"
                                        x2={`${50 + 35 * Math.cos((i * Math.PI * 2) / 6)}%`}
                                        y2={`${50 + 35 * Math.sin((i * Math.PI * 2) / 6)}%`}
                                        stroke="url(#tentacle-gradient)"
                                        strokeWidth="1"
                                        opacity="0.6"
                                    />
                                ))}
                                <defs>
                                    <linearGradient id="tentacle-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#22d3ee" />
                                        <stop offset="100%" stopColor="#6366f1" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>

                        <div className="text-center space-y-2">
                            <span className="text-cyan-400 font-mono tracking-widest text-lg animate-pulse">
                                ANALYZING DATA STREAMS...
                            </span>
                            <div className="flex justify-center gap-1">
                                {[0, 1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"
                                        style={{ animationDelay: `${i * 0.1}s` }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Stage: Result - Show Concept Graph */}
                {!isSearching && conceptMap && (
                    <div className="w-full h-full animate-fade-in">
                        <GraphErrorBoundary>
                            <ConceptGraph data={conceptMap} />
                        </GraphErrorBoundary>
                    </div>
                )}

                {/* Stage: Idle */}
                {!isSearching && !conceptMap && (
                    <div className="text-center space-y-6 animate-fade-in">
                        {/* Logo with glow effect */}
                        <div className="relative inline-block">
                            <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full" />
                            <Brain className="w-20 h-20 text-cyan-400 relative z-10" />
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-600 tracking-tight">
                            TENTACLE <span className="text-cyan-500">AI</span>
                        </h1>

                        <p className="text-slate-400 max-w-md mx-auto text-lg">
                            Connect your curiosity to the cosmos. Search to begin the neural link.
                        </p>

                        {/* Decorative tentacles */}
                        <div className="flex justify-center gap-3 mt-4">
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-1 h-8 bg-gradient-to-b from-cyan-500 to-transparent rounded-full animate-pulse"
                                    style={{ animationDelay: `${i * 0.2}s`, height: `${20 + i * 8}px` }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}


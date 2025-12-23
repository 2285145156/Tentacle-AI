import React, { useRef, useEffect, useCallback, useState, useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

export function ConceptGraph({ data }) {
    const graphRef = useRef();
    const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
    const containerRef = useRef();

    // Update dimensions on resize
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.offsetWidth || 800,
                    height: containerRef.current.offsetHeight || 500
                });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // Validate and transform data with safety checks
    const graphData = useMemo(() => {
        if (!data || !data.nodes || !Array.isArray(data.nodes) || data.nodes.length === 0) {
            return { nodes: [], links: [] };
        }

        const validNodes = data.nodes
            .filter(node => node && node.id && node.label)
            .map(node => ({
                id: String(node.id),
                label: String(node.label || 'Node'),
                size: Number(node.size) || 16,
                color: String(node.color || '#6366f1')
            }));

        const nodeIds = new Set(validNodes.map(n => n.id));

        const validLinks = (data.edges || [])
            .filter(edge => edge && edge.source && edge.target)
            .filter(edge => nodeIds.has(String(edge.source)) && nodeIds.has(String(edge.target)))
            .map(edge => ({
                source: String(edge.source),
                target: String(edge.target),
                label: String(edge.label || '')
            }));

        return { nodes: validNodes, links: validLinks };
    }, [data]);

    // Center the graph after initial render
    useEffect(() => {
        if (graphRef.current && graphData.nodes.length > 0) {
            const timer = setTimeout(() => {
                try {
                    graphRef.current.zoomToFit(400, 60);
                } catch (e) {
                    console.warn('Failed to zoom:', e);
                }
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [graphData]);

    // Custom node rendering with glow effect
    const nodeCanvasObject = useCallback((node, ctx, globalScale) => {
        if (!node || node.x === undefined || node.y === undefined) return;

        const label = node.label || '';
        const nodeSize = node.size || 16;
        const fontSize = Math.max(10, nodeSize / 2);
        const color = node.color || '#6366f1';

        try {
            // Draw glow effect
            const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, nodeSize * 1.5);
            gradient.addColorStop(0, color + '40');
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(node.x, node.y, nodeSize * 1.5, 0, 2 * Math.PI);
            ctx.fill();

            // Draw main node circle
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(node.x, node.y, nodeSize / 2, 0, 2 * Math.PI);
            ctx.fill();

            // Draw border
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(node.x, node.y, nodeSize / 2 + 2, 0, 2 * Math.PI);
            ctx.stroke();

            // Draw label
            ctx.font = `${fontSize}px Inter, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#e2e8f0';
            ctx.shadowColor = '#000';
            ctx.shadowBlur = 4;
            ctx.fillText(label, node.x, node.y + nodeSize / 2 + fontSize + 4);
            ctx.shadowBlur = 0;
        } catch (e) {
            console.warn('Node render error:', e);
        }
    }, []);

    // Custom link rendering
    const linkCanvasObject = useCallback((link, ctx) => {
        if (!link || !link.source || !link.target) return;

        const start = link.source;
        const end = link.target;

        if (start.x === undefined || start.y === undefined ||
            end.x === undefined || end.y === undefined) return;

        try {
            // Draw gradient line
            const gradient = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
            gradient.addColorStop(0, '#22d3ee80');
            gradient.addColorStop(0.5, '#6366f180');
            gradient.addColorStop(1, '#22d3ee80');

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();

            // Draw edge label if exists
            if (link.label) {
                const midX = (start.x + end.x) / 2;
                const midY = (start.y + end.y) / 2;
                ctx.font = '9px Inter, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = '#94a3b8';
                ctx.fillText(link.label, midX, midY - 6);
            }
        } catch (e) {
            console.warn('Link render error:', e);
        }
    }, []);

    // Show placeholder if no valid data
    if (graphData.nodes.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="text-cyan-500 text-xl font-mono">NO DATA</div>
                    <p className="text-slate-400">Waiting for concept map data...</p>
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="w-full h-full relative">
            <ForceGraph2D
                ref={graphRef}
                graphData={graphData}
                width={dimensions.width}
                height={dimensions.height}
                backgroundColor="transparent"
                nodeCanvasObject={nodeCanvasObject}
                nodePointerAreaPaint={(node, color, ctx) => {
                    if (!node || node.x === undefined || node.y === undefined) return;
                    ctx.fillStyle = color;
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, node.size || 16, 0, 2 * Math.PI);
                    ctx.fill();
                }}
                linkCanvasObject={linkCanvasObject}
                linkDirectionalParticles={2}
                linkDirectionalParticleSpeed={0.005}
                linkDirectionalParticleColor={() => '#22d3ee'}
                linkDirectionalParticleWidth={3}
                d3AlphaDecay={0.02}
                d3VelocityDecay={0.3}
                warmupTicks={50}
                cooldownTicks={100}
                enableNodeDrag={true}
                enableZoomInteraction={true}
                enablePanInteraction={true}
            />
        </div>
    );
}


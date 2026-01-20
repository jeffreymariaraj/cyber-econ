import React, { useMemo, useRef, useState, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import type { NodeObject } from 'react-force-graph-2d';
import type { RiskReport, Vulnerability } from '../types';

interface RiskGraphProps {
    report: RiskReport;
}

interface GraphNode extends NodeObject {
    id: string;
    group: 'asset' | 'vulnerability';
    val: number; // size
    name: string;
    color: string;
    details?: Vulnerability;
}

interface GraphLink {
    source: string;
    target: string;
}

const RiskGraph: React.FC<RiskGraphProps> = ({ report }) => {
    const fgRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

    useEffect(() => {
        if (containerRef.current) {
            setDimensions({
                width: containerRef.current.clientWidth,
                height: 500
            });
        }
    }, [containerRef.current]);

    const data = useMemo(() => {
        const nodes: GraphNode[] = [];
        const links: GraphLink[] = [];

        // 1. Central Asset Node
        nodes.push({
            id: 'asset',
            group: 'asset',
            val: 20,
            name: report.asset_name,
            color: '#4338ca', // Indigo-700
        });

        // 2. Vulnerability Nodes and Links
        report.vulnerabilities.forEach((vuln) => {
            const sev = vuln.severity;
            const severityColor =
                sev >= 9.0 ? '#ef4444' : // Critical (Red-500)
                    sev >= 7.0 ? '#f97316' :     // High (Orange-500)
                        sev >= 4.0 ? '#eab308' :   // Medium (Yellow-500)
                            '#22c55e';                 // Low (Green-500)

            nodes.push({
                id: vuln.cve_id,
                group: 'vulnerability',
                val: sev * 1.5,
                name: vuln.cve_id,
                color: severityColor,
                details: vuln,
            });

            links.push({
                source: 'asset',
                target: vuln.cve_id,
            });
        });

        return { nodes, links };
    }, [report]);

    return (
        <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Network Risk Topology</h3>
                <div className="flex gap-2 text-xs">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-700"></span>Asset</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span>Critical</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"></span>High</span>
                </div>
            </div>

            <div ref={containerRef} className="relative w-full h-[500px]">
                <ForceGraph2D
                    ref={fgRef}
                    width={dimensions.width}
                    height={dimensions.height}
                    graphData={data}
                    nodeLabel={(node: any) => {
                        if (node.group === 'asset') return node.name;
                        return `${node.name} (CVSS: ${node.details?.severity}) - ${node.details?.description?.substring(0, 50)}...`;
                    }}
                    nodeRelSize={6}
                    linkColor={() => '#e5e7eb'}
                    linkDirectionalParticles={2}
                    linkDirectionalParticleSpeed={0.005}
                    backgroundColor="#ffffff"
                    onNodeClick={(node: any) => {
                        if (fgRef.current) {
                            fgRef.current.centerAt(node.x, node.y, 1000);
                            fgRef.current.zoom(4, 2000);
                        }
                    }}
                    cooldownTicks={100}
                />
            </div>
            <div className="px-4 py-2 bg-gray-50 text-xs text-gray-400 text-center italic border-t border-gray-100">
                Data projected from mock Nmap scan • Force-directed Layout
            </div>
        </div>
    );
};

export default RiskGraph;

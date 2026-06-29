import React, { useState, useEffect } from "react";
import { API_BASE } from "../config";
import { Network, Building2, Coins, Sparkles, AlertCircle } from "lucide-react";

interface Node {
  id: string;
  label: string;
  type: string; // company, investor, product, competitor
  logo?: string;
}

interface Edge {
  source: string;
  target: string;
  relationship: string;
}

interface EcosystemGraphProps {
  companySlug: string;
}

export default function EcosystemGraph({ companySlug }: EcosystemGraphProps) {
  const [data, setData] = useState<{ nodes: Node[]; edges: Edge[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeNode, setActiveNode] = useState<Node | null>(null);

  useEffect(() => {
    async function fetchGraph() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/companies/${companySlug}/graph`)
        const json = await res.json();
        if (json && json.data) {
          setData(json.data);
          // Set central company as active
          const central = json.data.nodes.find((n: Node) => n.type === "company");
          if (central) setActiveNode(central);
        }
      } catch (err) {
        console.error("Failed to load ecosystem graph", err);
      } finally {
        setLoading(false);
      }
    }
    fetchGraph();
  }, [companySlug]);

  if (loading) {
    return (
      <div className="bg-slate-900/20 border border-slate-800/80 rounded-xl p-6 h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-400 font-mono">Generating ecosystem graph...</p>
        </div>
      </div>
    );
  }

  if (!data || data.nodes.length === 0) {
    return (
      <div className="bg-slate-900/20 border border-slate-800/80 rounded-xl p-6 h-96 flex items-center justify-center">
        <div className="text-center text-slate-500">
          <AlertCircle className="h-8 w-8 mx-auto mb-2 text-slate-600" />
          <p className="text-xs font-mono">No graph data found</p>
        </div>
      </div>
    );
  }

  // Circular layout coordinates calculation
  const centralNode = data.nodes.find(n => n.type === "company");
  const orbitalNodes = data.nodes.filter(n => n.type !== "company");

  const width = 500;
  const height = 320;
  const cx = width / 2;
  const cy = height / 2;
  const radius = 110;

  return (
    <div className="bg-slate-900/30 border border-slate-800/80 rounded-xl p-6 relative overflow-hidden" id="ecosystem-graph-container">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
            <Network className="h-4 w-4 text-red-500" />
            <span>Interactive Ecosystem Graph</span>
          </h3>
          <p className="text-[10px] text-slate-500 font-mono mt-0.5">1-hop connections including capital, products & competitors</p>
        </div>
        
        {activeNode && (
          <div className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/60 text-slate-300 border border-slate-700/50">
            Selected: <span className="font-semibold text-red-400 uppercase">{activeNode.type}</span> &bull; {activeNode.label}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* SVG Node Graph */}
        <div className="md:col-span-2 flex justify-center relative bg-slate-950/40 rounded-xl border border-slate-900 p-2">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto max-w-lg">
            {/* Draw Connection Edges */}
            {orbitalNodes.map((node, index) => {
              const angle = (index * 2 * Math.PI) / orbitalNodes.length;
              const x = cx + radius * Math.cos(angle);
              const y = cy + radius * Math.sin(angle);
              return (
                <line
                  key={`edge-${node.id}`}
                  x1={cx}
                  y1={cy}
                  x2={x}
                  y2={y}
                  stroke={activeNode?.id === node.id ? "#ef4444" : "#1e293b"}
                  strokeWidth={activeNode?.id === node.id ? "2" : "1.2"}
                  strokeDasharray={node.type === "competitor" ? "4,4" : "0"}
                  className="transition-all duration-300"
                />
              );
            })}

            {/* Central Node */}
            {centralNode && (
              <g 
                className="cursor-pointer" 
                onClick={() => setActiveNode(centralNode)}
              >
                <circle
                  cx={cx}
                  cy={cy}
                  r="30"
                  fill="#991b1b"
                  className="transition-all duration-300 hover:fill-red-800"
                  stroke="#ef4444"
                  strokeWidth="2"
                />
                {centralNode.logo ? (
                  <pattern id="central-logo" x="0" y="0" height="1" width="1">
                    <image x="10" y="10" height="40" width="40" href={centralNode.logo} referrerPolicy="no-referrer" />
                  </pattern>
                ) : null}
                <text
                  x={cx}
                  y={cy + 4}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {centralNode.label.substring(0, 5)}..
                </text>
              </g>
            )}

            {/* Orbital Nodes */}
            {orbitalNodes.map((node, index) => {
              const angle = (index * 2 * Math.PI) / orbitalNodes.length;
              const x = cx + radius * Math.cos(angle);
              const y = cy + radius * Math.sin(angle);

              // Colors based on types
              let color = "#334155";
              let strokeColor = "#475569";
              if (node.type === "investor") {
                color = "#064e3b";
                strokeColor = "#10b981";
              } else if (node.type === "product") {
                color = "#311042";
                strokeColor = "#c084fc";
              } else if (node.type === "competitor") {
                color = "#450a0a";
                strokeColor = "#f87171";
              }

              const isSelected = activeNode?.id === node.id;

              return (
                <g
                  key={node.id}
                  className="cursor-pointer group"
                  onClick={() => setActiveNode(node)}
                >
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? "22" : "18"}
                    fill={color}
                    stroke={isSelected ? "#ef4444" : strokeColor}
                    strokeWidth={isSelected ? "2.5" : "1.5"}
                    className="transition-all duration-300"
                  />
                  <text
                    x={x}
                    y={y + 3}
                    textAnchor="middle"
                    fill="#f1f5f9"
                    fontSize="7"
                    fontFamily="monospace"
                    fontWeight="semibold"
                    className="pointer-events-none"
                  >
                    {node.label.substring(0, 6)}
                  </text>
                  <title>{node.label} ({node.type})</title>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Node Details sidecard */}
        <div className="bg-slate-950/60 rounded-xl border border-slate-900 p-4 h-full flex flex-col justify-between">
          <div>
            <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase block mb-1">Entity Details</span>
            {activeNode ? (
              <div>
                <h4 className="text-sm font-semibold text-slate-100">{activeNode.label}</h4>
                <p className="text-[10px] font-mono text-red-400 capitalize mt-0.5">{activeNode.type}</p>
                
                <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                  {activeNode.type === "company" && "Primary entity. Connected to strategic funding sources, AI-focused assets, and other competitive labs."}
                  {activeNode.type === "investor" && "Venture partner providing early & growth capital to scale models and hardware deployments."}
                  {activeNode.type === "product" && "Software product launched to capture active market share and drive upvotes."}
                  {activeNode.type === "competitor" && "Alternative market lab exploring overlapping capabilities in generative logic."}
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Click any node to inspect relationship properties.</p>
            )}
          </div>

          <div className="mt-5 border-t border-slate-900 pt-3 flex flex-wrap gap-1.5 text-[8px] font-mono text-slate-500">
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">INVESTOR</span>
            <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/10">PRODUCT</span>
            <span className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/10">COMPETITOR</span>
          </div>
        </div>
      </div>
    </div>
  );
}

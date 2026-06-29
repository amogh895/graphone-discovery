import { API_BASE } from "../config";
import React, { useState, useRef, useEffect } from "react";
import { 
  Bot, 
  Send, 
  Sparkles, 
  Trash2, 
  ArrowRight, 
  Cpu, 
  Database,
  Layers,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AiAnalystPageProps {
  onCompanyClick: (slug: string) => void;
}

// Simple but elegant Markdown parser for safe, zero-dependency rendering in React 19
function renderMarkdown(text: string) {
  const lines = text.split("\n");
  
  return lines.map((line, idx) => {
    // 1. Check for Headers
    if (line.startsWith("### ")) {
      return (
        <h4 key={idx} className="text-sm font-semibold text-slate-200 mt-4 mb-2 tracking-tight flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
          {parseInline(line.substring(4))}
        </h4>
      );
    }
    if (line.startsWith("## ")) {
      return (
        <h3 key={idx} className="text-base font-bold text-white mt-6 mb-3 tracking-tight border-b border-slate-900 pb-1">
          {parseInline(line.substring(3))}
        </h3>
      );
    }
    if (line.startsWith("# ")) {
      return (
        <h2 key={idx} className="text-lg font-bold text-white mt-8 mb-4 tracking-tight">
          {parseInline(line.substring(2))}
        </h2>
      );
    }

    // 2. Check for Bullet Lists
    if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
      const content = line.trim().substring(2);
      return (
        <ul key={idx} className="list-disc list-inside ml-4 text-slate-300 space-y-1 my-1.5">
          <li className="text-xs leading-relaxed">{parseInline(content)}</li>
        </ul>
      );
    }

    // 3. Check for Blockquotes
    if (line.startsWith("> ")) {
      return (
        <blockquote key={idx} className="border-l-2 border-red-500/50 pl-4 py-1.5 my-3 bg-red-950/10 text-xs italic text-slate-400 rounded-r-md">
          {parseInline(line.substring(2))}
        </blockquote>
      );
    }

    // 4. Regular Paragraphs (skip empty lines to keep spacing nice)
    if (!line.trim()) {
      return <div key={idx} className="h-2"></div>;
    }

    return (
      <p key={idx} className="text-xs text-slate-300 leading-relaxed my-2">
        {parseInline(line)}
      </p>
    );
  });
}

// Inline formatting (bold, code segments)
function parseInline(text: string) {
  const parts: React.ReactNode[] = [];
  let currentText = text;
  let keyIdx = 0;

  while (currentText.length > 0) {
    const boldIndex = currentText.indexOf("**");
    const codeIndex = currentText.indexOf("`");

    // Match whichever comes first
    if (boldIndex !== -1 && (codeIndex === -1 || boldIndex < codeIndex)) {
      if (boldIndex > 0) {
        parts.push(currentText.substring(0, boldIndex));
      }
      const endBoldIndex = currentText.indexOf("**", boldIndex + 2);
      if (endBoldIndex !== -1) {
        parts.push(
          <strong key={keyIdx++} className="font-semibold text-white">
            {currentText.substring(boldIndex + 2, endBoldIndex)}
          </strong>
        );
        currentText = currentText.substring(endBoldIndex + 2);
      } else {
        parts.push(currentText.substring(boldIndex));
        break;
      }
    } else if (codeIndex !== -1) {
      if (codeIndex > 0) {
        parts.push(currentText.substring(0, codeIndex));
      }
      const endCodeIndex = currentText.indexOf("`", codeIndex + 1);
      if (endCodeIndex !== -1) {
        parts.push(
          <code key={keyIdx++} className="font-mono bg-slate-900 border border-slate-800 text-[10px] px-1.5 py-0.5 rounded text-red-400">
            {currentText.substring(codeIndex + 1, endCodeIndex)}
          </code>
        );
        currentText = currentText.substring(endCodeIndex + 1);
      } else {
        parts.push(currentText.substring(codeIndex));
        break;
      }
    } else {
      parts.push(currentText);
      break;
    }
  }

  return parts;
}

export default function AiAnalystPage({ onCompanyClick }: AiAnalystPageProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      role: "assistant",
      content: "Hello! I am **GraphOne Copilot**, your Venture Capitalist & Product-Market Fit co-analyst.\n\nI have direct access to our live startup ecosystem database, founder profiles, product stats, and current news. Ask me to compare competitors, evaluate growth metrics, or build customized intelligence memos on any tech sector.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const starterPrompts = [
    {
      title: "Analyze Competitors",
      prompt: "Compare the AI agent startups in the database (like NeuroFlow vs. AgentMesh). What is their competitive differentiation?",
      subtitle: "Sector Analysis"
    },
    {
      title: "Funding Breakdown",
      prompt: "Provide a quick breakdown of venture capital activity in our database. Which investors are leading the largest deals?",
      subtitle: "Venture Insights"
    },
    {
      title: "NeuroFlow Deepdive",
      prompt: "Generate a VC-style investment evaluation memo for 'NeuroFlow' using the metrics in our database.",
      subtitle: "Investment Memo"
    },
    {
      title: "Identify Unicorns",
      prompt: "Which listed startups are unicorns, and what are their corresponding Growth Scores and Valuations?",
      subtitle: "Valuation Matrix"
    }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    setErrorMsg(null);
    const userMessage: Message = {
      id: Math.random().toString(),
      role: "user",
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setStatusText("Analyzing ecosystem data...");

    const updatedMessages = [...messages, userMessage].map(m => ({
      role: m.role,
      content: m.content
    }));

    try {
      const response = await fetch(`${API_BASE}/api/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ messages: updatedMessages })
      });

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error.message || "Failed to generate response.");
      }

      const assistantMessage: Message = {
        id: Math.random().toString(),
        role: "assistant",
        content: result.data.content,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Something went wrong. Make sure your GEMINI_API_KEY is configured.");
    } finally {
      setIsLoading(false);
      setStatusText("");
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "initial",
        role: "assistant",
        content: "Hello! I am **GraphOne Copilot**, your Venture Capitalist & Product-Market Fit co-analyst.\n\nI have direct access to our live startup ecosystem database, founder profiles, product stats, and current news. Ask me to compare competitors, evaluate growth metrics, or build customized intelligence memos on any tech sector.",
        timestamp: new Date()
      }
    ]);
    setErrorMsg(null);
  };

  return (
    <div id="ai-analyst-container" className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in">
      {/* LEFT: Chat Workspace (3 cols) */}
      <div className="lg:col-span-3 flex flex-col bg-slate-900/45 border border-slate-900 rounded-xl overflow-hidden min-h-[calc(100vh-12rem)] shadow-xl">
        {/* Workspace Header */}
        <div className="px-6 py-4 bg-slate-900/80 border-b border-slate-900 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-red-600/10 rounded-lg flex items-center justify-center border border-red-900/30">
              <Bot className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
                GraphOne Intelligence Workspace
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-mono text-slate-400">Gemini 3.5 Flash Active</span>
              </div>
            </div>
          </div>

          <button 
            id="clear-chat-btn"
            onClick={clearChat}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-md border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-900/30 transition-all text-xs font-semibold"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear History</span>
          </button>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[500px]">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="h-8 w-8 rounded-lg bg-red-600/15 border border-red-900/25 flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-red-500" />
                  </div>
                )}
                
                <div 
                  className={`max-w-[85%] rounded-xl px-4 py-3 border text-xs shadow-md ${
                    msg.role === "user" 
                      ? "bg-red-600/10 border-red-900/40 text-slate-200" 
                      : "bg-slate-950/80 border-slate-900 text-slate-300"
                  }`}
                >
                  <div className="prose prose-invert prose-xs">
                    {renderMarkdown(msg.content)}
                  </div>
                  <div className="mt-1.5 text-[9px] font-mono text-slate-500 text-right">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {msg.role === "user" && (
                  <div className="h-8 w-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                    <span className="text-xs font-semibold text-slate-300">ME</span>
                  </div>
                )}
              </motion.div>
            ))}

            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-4 justify-start"
              >
                <div className="h-8 w-8 rounded-lg bg-red-600/15 border border-red-900/25 flex items-center justify-center animate-pulse shrink-0">
                  <Bot className="h-4 w-4 text-red-500 animate-bounce" />
                </div>
                <div className="max-w-[85%] rounded-xl px-4 py-3 bg-slate-950/80 border border-slate-900 text-slate-300 flex items-center space-x-3">
                  <div className="flex space-x-1.5">
                    <div className="h-1.5 w-1.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="h-1.5 w-1.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="h-1.5 w-1.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">{statusText}</span>
                </div>
              </motion.div>
            )}

            {errorMsg && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-red-950/20 border border-red-900/30 rounded-xl flex items-start gap-3"
              >
                <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-red-400">Execution Error</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{errorMsg}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Action input bar */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-900">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(input); }} 
            className="relative flex items-center bg-slate-900/90 border border-slate-800 focus-within:border-red-900/50 rounded-lg overflow-hidden transition-all pl-3 pr-1.5 py-1.5"
          >
            <input 
              id="ai-analyst-input"
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about startups, valuations, funding stages, unicorn trends..."
              disabled={isLoading}
              className="flex-1 bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none py-1.5"
            />
            <button 
              id="ai-analyst-submit"
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:hover:bg-red-600 text-white p-2 rounded-md transition-all shrink-0"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
          <p className="text-[10px] text-slate-500 font-mono text-right mt-1.5">
            Press Enter or click the send arrow to dispatch request to LLM.
          </p>
        </div>
      </div>

      {/* RIGHT: Context Sidebar (1 col) */}
      <div className="space-y-6">
        {/* Live Monitors */}
        <div className="bg-slate-900/45 border border-slate-900 rounded-xl p-5 space-y-4 shadow-md">
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
            Grounding Data Monitor
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2.5 bg-slate-950/50 border border-slate-900 rounded-lg">
              <div className="flex items-center space-x-2">
                <Database className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-[11px] text-slate-300">Live Database Feed</span>
              </div>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-950/50 border border-slate-900 rounded-lg">
              <div className="flex items-center space-x-2">
                <Cpu className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-[11px] text-slate-300">LLM Inference Mode</span>
              </div>
              <span className="text-[9px] font-mono font-semibold bg-red-950/40 text-red-400 px-1.5 py-0.5 rounded border border-red-900/30 uppercase">
                Active
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-950/50 border border-slate-900 rounded-lg">
              <div className="flex items-center space-x-2">
                <Layers className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-[11px] text-slate-300">Dynamic Context</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Auto-inject</span>
            </div>
          </div>
          
          <div className="h-[1px] bg-slate-900 my-4"></div>
          
          <p className="text-[10px] text-slate-500 leading-normal">
            Every query you submit pulls real-time contextual information from the platform's database (valuation sheets, funding rounds, news headers) ensuring precise, non-hallucinated results.
          </p>
        </div>

        {/* Starter Suggestion Prompts */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono px-1">
            Suggested Analysis
          </h3>

          <div className="grid grid-cols-1 gap-2.5">
            {starterPrompts.map((s, idx) => (
              <button
                key={idx}
                id={`ai-prompt-suggestion-${idx}`}
                onClick={() => handleSend(s.prompt)}
                disabled={isLoading}
                className="w-full text-left p-3.5 bg-slate-900/30 hover:bg-slate-900 border border-slate-900 hover:border-red-900/20 rounded-xl transition-all group flex flex-col justify-between gap-2.5 shadow"
              >
                <div>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-red-500">
                    {s.subtitle}
                  </span>
                  <h4 className="text-xs font-medium text-slate-200 mt-1">
                    {s.title}
                  </h4>
                </div>
                <div className="flex items-center text-[10px] text-slate-500 group-hover:text-red-400 font-mono font-bold transition-all">
                  <span>Analyze prompt</span>
                  <ArrowRight className="h-3 w-3 ml-1 translate-x-0 group-hover:translate-x-1 transition-all" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

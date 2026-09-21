/* eslint-disable react-hooks/purity */
"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import {
  MessageSquare,
  X,
  Send,
  RefreshCw,
  Bot,
  User,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import {
  queryRagAction,
  ingestDoctorsAction,
  getUserRoleAction,
} from "@/app/_actions/rag.actions";

// ─── Types ────────────────────────────────────────────────────────────────────

type MessageSource = {
  id: string;
  content: string;
  similarity: number;
  metadata?: { name?: string; [key: string]: unknown };
  sourceType?: string;
};

type Message = {
  id: string;
  role: "user" | "bot";
  content: string;
  sources?: MessageSource[];
  isError?: boolean;
  queryToRetry?: string;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: "welcome",
    role: "bot",
    content:
      "Hello! I'm your AI healthcare assistant 👋\n\nAsk me anything about our doctors — their specialties, experience, fees, or patient reviews. I'll find the best match for you.",
  },
];

const SUGGESTED_QUERIES = [
  "Best cardiologists available?",
  "Neurologist in Dhaka?",
  "Affordable pediatricians?",
];

// ─── Typing Dots ──────────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 max-w-[85%]">
      <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center shrink-0 shadow-md">
        <Bot size={16} className="text-white" />
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1">
          <span
            className="w-2 h-2 rounded-full bg-slate-400 inline-block animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="w-2 h-2 rounded-full bg-slate-400 inline-block animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="w-2 h-2 rounded-full bg-slate-400 inline-block animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────

function MessageBubble({
  message,
  onRetry,
}: {
  message: Message;
  onRetry?: (query: string) => void;
}) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-md ${
          isUser
            ? "bg-linear-to-br from-slate-600 to-slate-800"
            : "bg-linear-to-br from-blue-500 to-violet-600"
        }`}
      >
        {isUser ? (
          <User size={16} className="text-white" />
        ) : (
          <Bot size={16} className="text-white" />
        )}
      </div>

      <div
        className={`flex flex-col gap-1.5 max-w-[78%] ${isUser ? "items-end" : "items-start"}`}
      >
        {/* Bubble */}
        <div
          className={`px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? "bg-linear-to-br from-blue-600 to-violet-600 text-white rounded-2xl rounded-br-sm shadow-md"
              : "bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-bl-sm shadow-sm"
          }`}
        >
          {typeof message.content === "string"
            ? message.content
                .split(/(\*\*.*?\*\*)/g)
                .map((part, i) =>
                  part.startsWith("**") && part.endsWith("**") ? (
                    <strong key={i}>{part.slice(2, -2)}</strong>
                  ) : (
                    part
                  ),
                )
            : JSON.stringify(message.content, null, 2)}
        </div>

        {/* Error Retry Button */}
        {message.isError && onRetry && message.queryToRetry && (
          <button
            onClick={() => onRetry(message.queryToRetry!)}
            className="flex items-center gap-1 text-[10px] text-blue-600 hover:text-blue-700 font-medium mt-1 cursor-pointer bg-blue-50 px-2 py-1 rounded-md border border-blue-100"
          >
            <RefreshCw size={10} />
            Retry
          </button>
        )}

        {/* Sources */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="flex flex-wrap gap-1 px-1">
            <span className="text-[10px] text-slate-400 w-full mb-0.5">
              Sources:
            </span>
            {message.sources.map((src, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-medium"
              >
                <Sparkles size={8} />
                {src?.metadata?.name
                  ? String(src.metadata.name)
                  : `Source ${i + 1}`}
                {typeof src.similarity === "number" && (
                  <span className="text-blue-400">
                    {(src.similarity * 100).toFixed(0)}%
                  </span>
                )}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isQuerying, startQueryTransition] = useTransition();
  const [isSyncing, startSyncTransition] = useTransition();
  const [userRole, setUserRole] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch user role on mount
  useEffect(() => {
    const fetchRole = async () => {
      const role = await getUserRoleAction();
      setUserRole(role);
    };
    fetchRole();
  }, []);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isQuerying]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // ── Sync handler ────────────────────────────────────────────────────────
  const handleSync = () => {
    startSyncTransition(async () => {
      const result = await ingestDoctorsAction();
      if (result.success) {
        toast.success(`Doctor data synced!`, {
          description:
            result.message ?? `${result.indexedCount ?? 0} doctors indexed.`,
        });
      } else {
        toast.error("Sync failed", { description: result.error });
      }
    });
  };

  // ── Send message handler ─────────────────────────────────────────────────
  const handleSend = (query?: string) => {
    const text = (query ?? inputValue).trim();
    if (!text || isQuerying) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");

    startQueryTransition(async () => {
      const result = await queryRagAction(text);

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        role: "bot",
        content: result.success
          ? result.answer!
          : (result.error ?? "Something went wrong. Please try again."),
        sources: result.success ? result.sources : undefined,
        isError: !result.success,
        queryToRetry: !result.success ? text : undefined,
      };

      setMessages((prev) => [...prev, botMsg]);
    });
  };

  return (
    <>
      {/* ── Chat Window ────────────────────────────────────────────────── */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-88 sm:w-104 flex flex-col rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden bg-white transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-6 pointer-events-none"
        }`}
        style={{ maxHeight: "78vh" }}
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="bg-linear-to-br from-blue-600 to-violet-600 px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Bot size={20} className="text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm leading-none">
                AI Health Assistant
              </p>
              <p className="text-blue-100 text-[10px] mt-0.5">
                Powered by RAG · Always online
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {/* Sync button — ADMIN ONLY */}
            {(userRole === "ADMIN" || userRole === "SUPER_ADMIN") && (
              <button
                onClick={handleSync}
                disabled={isSyncing}
                title="Sync Doctor Data"
                className="w-8 h-8 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors disabled:opacity-60 cursor-pointer"
              >
                <RefreshCw
                  size={16}
                  className={isSyncing ? "animate-spin" : ""}
                />
              </button>
            )}
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer"
            >
              <ChevronDown size={18} />
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60 min-h-0"
          style={{ minHeight: "200px", maxHeight: "55vh" }}
        >
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} onRetry={handleSend} />
          ))}

          {isQuerying && <TypingIndicator />}

          {/* Suggested queries — only shown when only welcome message exists */}
          {messages.length === 1 && !isQuerying && (
            <div className="flex flex-col gap-2 mt-2">
              <p className="text-[11px] text-slate-400 font-medium px-1">
                Try asking:
              </p>
              {SUGGESTED_QUERIES.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="text-left text-xs bg-white border border-slate-200 text-slate-600 px-3 py-2 rounded-xl hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer shadow-sm"
                >
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="shrink-0 px-3 py-3 bg-white border-t border-slate-100">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask about doctors, specialties..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isQuerying}
              className="flex-1 text-sm bg-slate-100 border border-transparent focus:border-blue-300 focus:bg-white rounded-xl px-3 py-2.5 outline-none transition-all placeholder:text-slate-400 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={isQuerying || !inputValue.trim()}
              className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 cursor-pointer shadow-md"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* ── Floating Trigger Button ────────────────────────────────────── */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close AI assistant" : "Open AI assistant"}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-linear-to-br from-blue-600 to-violet-600 text-white flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer ${
          isOpen ? "rotate-90" : "rotate-0"
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {/* Pulsing ring when closed */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-blue-500 opacity-30 animate-ping" />
        )}
      </button>
    </>
  );
}

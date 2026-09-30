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
    <div role="status" aria-label="Assistant is typing" className="flex max-w-[85%] items-end gap-2">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#174c3b] text-white">
        <Bot size={16} className="text-white" />
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1">
          <span
            className="inline-block h-2 w-2 animate-bounce rounded-full bg-[#6c9a78] motion-reduce:animate-none"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="inline-block h-2 w-2 animate-bounce rounded-full bg-[#6c9a78] motion-reduce:animate-none"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="inline-block h-2 w-2 animate-bounce rounded-full bg-[#6c9a78] motion-reduce:animate-none"
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
            ? "bg-[#e8f1e8] text-[#174c3b]"
            : "bg-[#174c3b] text-white"
        }`}
      >
        {isUser ? (
          <User size={16} className="text-current" />
        ) : (
          <Bot size={16} className="text-current" />
        )}
      </div>

      <div
        className={`flex flex-col gap-1.5 max-w-[78%] ${isUser ? "items-end" : "items-start"}`}
      >
        {/* Bubble */}
        <div
          className={`px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? "rounded-2xl rounded-br-sm bg-[#174c3b] text-white"
              : "rounded-2xl rounded-bl-sm border border-[#dce7df] bg-white text-[#253d32] shadow-sm"
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
            className="mt-1 inline-flex cursor-pointer items-center gap-1 rounded-md border border-[#dce7df] bg-white px-2 py-1 text-[11px] font-medium text-[#174c3b] transition-colors hover:bg-[#f3f7f4]"
          >
            <RefreshCw size={10} />
            Retry
          </button>
        )}

        {/* Sources */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="flex flex-wrap gap-1 px-1">
            <span className="mb-0.5 w-full text-[10px] text-[#718177]">
              Sources:
            </span>
            {message.sources.map((src, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 rounded-full border border-[#dce7df] bg-[#f3f7f4] px-2 py-1 text-[10px] font-medium text-[#174c3b]"
              >
                <Sparkles size={8} />
                {src?.metadata?.name
                  ? String(src.metadata.name)
                  : `Source ${i + 1}`}
                {typeof src.similarity === "number" && (
                  <span className="text-[#718177]">
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
  const triggerRef = useRef<HTMLButtonElement>(null);

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
      const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 160);
      return () => window.clearTimeout(focusTimer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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
        id="ai-health-assistant"
        role="region"
        aria-label="AI healthcare assistant"
        className={`fixed inset-x-4 bottom-24 z-50 mx-auto flex w-auto max-w-104 flex-col overflow-hidden rounded-xl border border-[#dce7df] bg-white shadow-[0_24px_70px_rgba(23,55,45,0.2)] transition-all duration-200 ease-out motion-reduce:transform-none motion-reduce:transition-none sm:inset-x-auto sm:right-6 ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-6 pointer-events-none"
        }`}
        style={{ maxHeight: "calc(100dvh - 7rem)" }}
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between bg-[#174c3b] px-4 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/12 text-[#d9ef9f]">
              <Bot size={20} className="text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm leading-none">
                AI Health Assistant
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-[10px] text-white/75">
                <span className="h-1.5 w-1.5 rounded-full bg-[#d9ef9f]" />
                Ready to help
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
                aria-label={isSyncing ? "Syncing doctor data" : "Sync doctor data"}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-white transition-colors hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw
                  size={16}
                  className={isSyncing ? "animate-spin" : ""}
                />
              </button>
            )}
            {/* Close button */}
            <button
              onClick={() => {
                setIsOpen(false);
                triggerRef.current?.focus();
              }}
              aria-label="Minimize assistant"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-white transition-colors hover:bg-white/15"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div
          ref={scrollRef}
          className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-[#f5f8f5] p-4"
          style={{ minHeight: "200px", maxHeight: "55dvh" }}
        >
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} onRetry={handleSend} />
          ))}

          {isQuerying && <TypingIndicator />}

          {/* Suggested queries — only shown when only welcome message exists */}
          {messages.length === 1 && !isQuerying && (
            <div className="flex flex-col gap-2 mt-2">
              <p className="px-1 text-[11px] font-medium text-[#718177]">
                Suggested questions
              </p>
              {SUGGESTED_QUERIES.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="cursor-pointer rounded-lg border border-[#dce7df] bg-white px-3 py-2.5 text-left text-xs text-[#43564a] shadow-sm transition-colors hover:border-[#9dbba4] hover:bg-[#f3f7f4] hover:text-[#174c3b]"
                >
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="shrink-0 border-t border-[#e7eee8] bg-white px-3 py-3">
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
              aria-label="Ask the healthcare assistant"
              className="min-w-0 flex-1 rounded-lg border border-transparent bg-[#f3f7f4] px-3 py-2.5 text-sm text-[#253d32] outline-none transition-colors placeholder:text-[#85938a] focus:border-[#174c3b] focus:bg-white focus:ring-2 focus:ring-[#174c3b]/10 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={isQuerying || !inputValue.trim()}
              aria-label="Send message"
              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-[#174c3b] text-white shadow-sm transition-all hover:bg-[#23634d] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none motion-reduce:active:scale-100"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* ── Floating Trigger Button ────────────────────────────────────── */}
      <button
        ref={triggerRef}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close AI assistant" : "Open AI assistant"}
        aria-expanded={isOpen}
        aria-controls="ai-health-assistant"
        className={`fixed bottom-5 right-5 z-50 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-[#174c3b] text-white shadow-lg transition-all duration-200 hover:bg-[#23634d] hover:shadow-xl hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#174c3b] motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100 ${
          isOpen ? "rotate-90" : "rotate-0"
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {/* Pulsing ring when closed */}
        {!isOpen && (
          <span className="absolute inset-0 animate-ping rounded-full bg-[#6c9a78] opacity-25 motion-reduce:animate-none" />
        )}
      </button>
    </>
  );
}

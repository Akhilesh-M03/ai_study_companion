import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Lightbulb, Send, Sparkles, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { sendChatMessage } from "../services/chatApi";
import {
  CHAT_HISTORY_WINDOWS,
  TARGET_INPUT_TOKENS,
} from "../config/chatConfig";

const promptPills = [
  "Explain Big O Notation",
  "Debug my Spring Boot API",
  "Optimize my React component re-renders",
];

const createMessage = ({ role, text, includeInHistory = true }) => ({
  id: `${Date.now()}-${Math.round(Math.random() * 10000)}`,
  role,
  text,
  includeInHistory,
});

const stripThinkSections = (text) =>
  text.replace(/<think\b[^>]*>[\s\S]*?<\/think>/gi, "");

const sanitizeAssistantReply = (text) => {
  const withoutThink = stripThinkSections(text || "");
  return withoutThink.replace(/\n{3,}/g, "\n\n").trim();
};

const estimateTokenCount = (text) => Math.ceil(text.length / 4);

const buildChatHistory = (messages, upcomingPrompt) => {
  const largestWindow = Math.max(...CHAT_HISTORY_WINDOWS);
  const normalizedHistory = messages
    .filter(
      (message) =>
        message.includeInHistory !== false &&
        (message.role === "user" || message.role === "assistant") &&
        typeof message.text === "string" &&
        message.text.trim().length > 0,
    )
    .slice(-largestWindow)
    .map((message) => ({
      role: message.role,
      content:
        message.role === "assistant"
          ? sanitizeAssistantReply(message.text)
          : message.text.trim(),
    }))
    .filter((message) => message.content.length > 0);

  const promptText = (upcomingPrompt || "").trim();

  for (const windowSize of CHAT_HISTORY_WINDOWS) {
    const candidate = normalizedHistory.slice(-windowSize);
    const historyText = candidate.map((item) => item.content).join("\n");
    const totalInputTokens = estimateTokenCount(
      `${historyText}\n${promptText}`,
    );

    if (totalInputTokens <= TARGET_INPUT_TOKENS) {
      return candidate;
    }
  }

  const smallestWindow = CHAT_HISTORY_WINDOWS[CHAT_HISTORY_WINDOWS.length - 1];
  return normalizedHistory.slice(-smallestWindow);
};

const AIChat = () => {
  const MotionArticle = motion.article;
  const location = useLocation();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [thinkingDots, setThinkingDots] = useState(".");
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) {
      return;
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    const promptFromQuiz = location.state?.seedPrompt;
    if (!promptFromQuiz || typeof promptFromQuiz !== "string") {
      return;
    }

    submitPrompt(promptFromQuiz);
    window.history.replaceState({}, document.title);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  useEffect(() => {
    if (!isSending) {
      setThinkingDots(".");
      return;
    }

    const intervalId = window.setInterval(() => {
      setThinkingDots((prev) => (prev.length >= 3 ? "." : `${prev}.`));
    }, 400);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isSending]);

  const canSend = input.trim().length > 0 && !isSending;

  const submitPrompt = async (promptText) => {
    const prompt = promptText.trim();
    if (!prompt) return;

    if (isSending) {
      return;
    }

    const userMessage = createMessage({ role: "user", text: prompt });
    const history = buildChatHistory(messages, prompt);
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setIsSending(true);
    try {
      const response = await sendChatMessage(prompt, history);
      const aiMessage = createMessage({
        role: "assistant",
        text:
          sanitizeAssistantReply(response?.reply) ||
          "I could not generate a response.",
      });
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const aiMessage = createMessage({
        role: "assistant",
        text:
          typeof error?.message === "string"
            ? `I hit an error: ${error.message}`
            : "I could not reach the AI service right now.",
      });
      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const startNewChat = () => {
    setMessages([
      createMessage({
        role: "assistant",
        text: "New chat started. Ask me anything about DSA, React, or Spring Boot.",
        includeInHistory: false,
      }),
    ]);
    setInput("");
  };

  const parsedMessages = useMemo(() => messages, [messages]);

  return (
    <div className="bg-slate-50 min-h-full">
      <section className="max-w-5xl mx-auto bg-white border border-slate-200 shadow-sm rounded-2xl p-4 md:p-6">
        <header className="pb-4 border-b border-slate-200">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
                Adaptive Learning Assistant
              </h2>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              Live Tutor
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={startNewChat}
              className="px-4 py-2 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
            >
              New Chat
            </button>
          </div>
        </header>

        <div
          ref={messagesContainerRef}
          className="h-[54vh] overflow-y-auto py-4 pr-1 space-y-4"
        >
          <AnimatePresence initial={false}>
            {parsedMessages.length === 0 ? (
              <MotionArticle
                key="empty-state"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex justify-start"
              >
                <div className="max-w-[92%] md:max-w-[85%] rounded-2xl px-4 py-3 bg-slate-100 text-slate-800 border border-slate-200">
                  <div className="flex items-center gap-2 mb-2 text-xs font-semibold opacity-90">
                    <Bot className="w-3.5 h-3.5" />
                    AI Tutor
                  </div>
                  <p className="text-sm leading-relaxed">
                    Hi, I am your AI study companion. Ask me for explanations,
                    debugging help, or a focused practice plan. You can also tap
                    one of the quick prompts below to get started.
                  </p>
                </div>
              </MotionArticle>
            ) : null}

            {parsedMessages.map((message) => (
              <MotionArticle
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[92%] md:max-w-[85%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-100 text-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2 text-xs font-semibold opacity-90">
                    {message.role === "assistant" ? (
                      <Bot className="w-3.5 h-3.5" />
                    ) : (
                      <User className="w-3.5 h-3.5" />
                    )}
                    {message.role === "assistant" ? "AI Tutor" : "You"}
                  </div>

                  <div className="space-y-3">
                    {message.role === "assistant" ? (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ children }) => (
                            <p className="text-sm leading-7 text-balance">
                              {children}
                            </p>
                          ),
                          h1: ({ children }) => (
                            <h1 className="text-base font-bold mt-1 mb-2">
                              {children}
                            </h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="text-[15px] font-bold mt-1 mb-2">
                              {children}
                            </h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="text-sm font-semibold mt-1 mb-2">
                              {children}
                            </h3>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc pl-5 space-y-1 text-sm leading-7">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal pl-5 space-y-1 text-sm leading-7">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => <li>{children}</li>,
                          hr: () => <hr className="border-slate-300 my-2" />,
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-slate-300 pl-3 text-slate-600 italic">
                              {children}
                            </blockquote>
                          ),
                          code: ({ inline, children }) =>
                            inline ? (
                              <code className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-800 text-[12px]">
                                {children}
                              </code>
                            ) : (
                              <code className="text-[13px] leading-relaxed">
                                {children}
                              </code>
                            ),
                          pre: ({ children }) => (
                            <pre className="rounded-xl border border-slate-300 bg-slate-900 text-slate-100 p-3 overflow-x-auto text-[13px] leading-relaxed">
                              {children}
                            </pre>
                          ),
                          a: ({ href, children }) => (
                            <a
                              href={href}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-700 underline underline-offset-2"
                            >
                              {children}
                            </a>
                          ),
                        }}
                      >
                        {message.text}
                      </ReactMarkdown>
                    ) : (
                      <p className="text-sm leading-7 text-balance whitespace-pre-wrap">
                        {message.text}
                      </p>
                    )}
                  </div>
                </div>
              </MotionArticle>
            ))}

            {isSending ? (
              <MotionArticle
                key="assistant-thinking"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex justify-start"
              >
                <div className="max-w-[92%] md:max-w-[85%] rounded-2xl px-4 py-3 bg-slate-100 text-slate-800 border border-slate-200">
                  <div className="flex items-center gap-2 mb-2 text-xs font-semibold opacity-90">
                    <Bot className="w-3.5 h-3.5" />
                    AI Tutor
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Thinking{thinkingDots}
                  </div>
                </div>
              </MotionArticle>
            ) : null}
          </AnimatePresence>
        </div>

        <footer className="pt-4 border-t border-slate-200">
          <div className="flex flex-wrap gap-2 mb-3">
            {promptPills.map((pill) => (
              <button
                key={pill}
                onClick={() => submitPrompt(pill)}
                className="rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 px-3 py-1.5 text-xs font-medium inline-flex items-center gap-1.5"
              >
                <Lightbulb className="w-3.5 h-3.5 text-emerald-600" />
                {pill}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submitPrompt(input);
                }
              }}
              placeholder="Ask anything about DSA, React, or Spring Boot"
              className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-emerald-500/35 focus:border-emerald-500"
              disabled={isSending}
            />
            <button
              onClick={() => submitPrompt(input)}
              disabled={!canSend}
              className="w-11 h-11 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
};

export default AIChat;

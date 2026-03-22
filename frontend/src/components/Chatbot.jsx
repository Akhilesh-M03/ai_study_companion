import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bot, Brain, MessageSquareText, Send, User } from 'lucide-react';

const modeOptions = ['Learn Mode', 'Quiz Mode', 'Revision Mode'];

const createMessage = ({ role, text, suggestions = [] }) => ({
  id: `${Date.now()}-${Math.round(Math.random() * 10000)}`,
  role,
  text,
  suggestions,
});

const buildInitialMessages = (seedPrompt) => {
  const base = [
    createMessage({
      role: 'assistant',
      text: 'I see you struggled with Trigonometry earlier. Want to review?',
    }),
    createMessage({
      role: 'user',
      text: 'Explain my mistake in integration',
    }),
    createMessage({
      role: 'assistant',
      text: 'You made a method-selection mistake in integration. You started with substitution, but this expression is cleaner with partial fractions. Also keep the integration constant after combining terms. Try solving again with that order: simplify, choose method, integrate, then add C.',
      suggestions: ['Try similar question', 'Give hint', 'Revise topic'],
    }),
  ];

  if (!seedPrompt || seedPrompt.toLowerCase().includes('explain my mistake in integration')) {
    return base;
  }

  return [
    ...base,
    createMessage({ role: 'user', text: seedPrompt }),
    createMessage({
      role: 'assistant',
      text: 'Thanks for the context. I will break this into concept, method, and one corrected example so you can retry confidently.',
      suggestions: ['Try similar question', 'Give hint', 'Revise topic'],
    }),
  ];
};

const getAiReplyByMode = (mode, prompt) => {
  if (mode === 'Quiz Mode') {
    return {
      text: `Quiz Mode active. Based on "${prompt}", here is your quick check: Which method would you apply first for this integration pattern?`,
      suggestions: ['Try similar question', 'Give hint', 'Revise topic'],
    };
  }

  if (mode === 'Revision Mode') {
    return {
      text: `Revision Mode active. For "${prompt}", revise with this sequence: key formula, solved example, one timed practice question.`,
      suggestions: ['Try similar question', 'Give hint', 'Revise topic'],
    };
  }

  return {
    text: `Learn Mode active. For "${prompt}", focus on why your first method failed and how to identify the right method quickly next time.`,
    suggestions: ['Try similar question', 'Give hint', 'Revise topic'],
  };
};

const Chatbot = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const seedPrompt = (location.state?.seedPrompt || '').trim();

  const [mode, setMode] = useState('Learn Mode');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(() => buildInitialMessages(seedPrompt));

  const sendMessage = () => {
    const prompt = input.trim();
    if (!prompt) {
      return;
    }

    const userMessage = createMessage({ role: 'user', text: prompt });
    const aiReply = getAiReplyByMode(mode, prompt);
    const aiMessage = createMessage({ role: 'assistant', ...aiReply });

    setMessages((prev) => [...prev, userMessage, aiMessage]);
    setInput('');
  };

  const handleSuggestion = (action) => {
    if (action === 'Try similar question') {
      navigate('/quiz');
      return;
    }

    if (action === 'Revise topic') {
      navigate('/flashcards');
      return;
    }

    const hintMessage = createMessage({
      role: 'assistant',
      text: 'Hint: before integrating, classify the expression shape. If it is a rational function, test partial fractions first.',
      suggestions: ['Try similar question', 'Revise topic'],
    });
    setMessages((prev) => [...prev, hintMessage]);
  };

  return (
    <section className="max-w-5xl mx-auto rounded-3xl border border-primary/15 bg-card/85 backdrop-blur-xl shadow-2xl overflow-hidden">
      <header className="p-5 md:p-6 border-b border-primary/10 bg-background/45">
        <p className="text-xs font-bold uppercase tracking-widest text-secondary-text">Phase 4 • Smart AI Chatbot</p>
        <h2 className="text-2xl font-black mt-1 flex items-center gap-2">
          <MessageSquareText className="w-6 h-6 text-primary" />
          Contextual Learning Assistant
        </h2>

        <div className="flex flex-wrap gap-2 mt-4">
          {modeOptions.map((item) => (
            <button
              key={item}
              onClick={() => setMode(item)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                mode === item
                  ? 'bg-primary text-white'
                  : 'bg-background/60 text-secondary-text border border-primary/20 hover:text-primary-text'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </header>

      <div className="h-[56vh] overflow-y-auto p-5 md:p-6 space-y-4 bg-gradient-to-b from-transparent to-background/30">
        {messages.map((message) => (
          <article key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[86%] rounded-2xl px-4 py-3 border ${
                message.role === 'user'
                  ? 'bg-primary text-white border-primary/30'
                  : 'bg-background/65 text-primary-text border-primary/15 backdrop-blur-md'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5 text-xs font-bold opacity-85">
                {message.role === 'assistant' ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                {message.role === 'assistant' ? 'AI Tutor' : 'You'}
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-line">{message.text}</p>

              {message.role === 'assistant' && message.suggestions.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {message.suggestions.map((item) => (
                    <button
                      key={`${message.id}-${item}`}
                      onClick={() => handleSuggestion(item)}
                      className="text-[11px] font-bold px-2.5 py-1 rounded-full border border-primary/20 bg-primary/10 hover:bg-primary/20 transition-colors"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </article>
        ))}
      </div>

      <footer className="p-4 md:p-5 border-t border-primary/10 bg-background/55">
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-xl border border-primary/20 bg-background/60 flex items-center justify-center text-primary" disabled>
            <Brain className="w-4 h-4" />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Ask for explanation, hint, quiz, or revision"
            className="flex-1 rounded-xl border border-primary/20 bg-background/60 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/60"
          />
          <button
            onClick={sendMessage}
            className="w-10 h-10 rounded-xl bg-primary hover:bg-secondary text-white flex items-center justify-center transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </section>
  );
};

export default Chatbot;

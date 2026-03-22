import React, { useCallback, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Send, Brain, Bot, User } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';

const modeOptions = ['Learn Mode', 'Quiz Mode', 'Revision Mode'];

const createMessage = ({ role, text, topic = '', suggestions = [] }) => ({
  id: `${Date.now()}-${Math.round(Math.random() * 10000)}`,
  role,
  text,
  topic,
  suggestions,
});

const buildAiReply = ({ prompt, mode, fallbackTopic, latestWeakTopic }) => {
  const lower = prompt.toLowerCase();
  const topic = fallbackTopic || latestWeakTopic;

  if (lower.includes('test me')) {
    return {
      text: `Quick challenge time. ${topic ? `Let's target ${topic}. ` : ''}I can start a 3-question rapid quiz right now.`,
      topic,
      suggestions: ['Try similar question', 'Give hint', 'Revise topic'],
    };
  }

  if (lower.includes('explain my mistake')) {
    return {
      text: `${latestWeakTopic ? `You struggled with ${latestWeakTopic} earlier. ` : ''}Your likely error pattern is concept recall under pressure. Slow down, identify the concept first, then solve.`,
      topic: latestWeakTopic || topic,
      suggestions: ['Try similar question', 'Give hint', 'Revise topic'],
    };
  }

  if (topic) {
    return {
      text: `${latestWeakTopic ? `You struggled with ${latestWeakTopic} earlier. ` : ''}Here is a clear explanation for ${topic}: focus on concept, then formula, then one solved example, then one self-test.`,
      topic,
      suggestions: ['Try similar question', 'Give hint', 'Revise topic'],
    };
  }

  return {
    text: `In ${mode}, I recommend this cycle: concept recap, one applied question, instant feedback, and targeted revision.`,
    topic: latestWeakTopic,
    suggestions: ['Try similar question', 'Give hint', 'Revise topic'],
  };
};

const buildInitialMessages = ({ initialPrompt, latestWeakTopic }) => {
  const intro = createMessage({
    role: 'assistant',
    text: `Hi! Ask me anything. ${latestWeakTopic ? `You struggled with ${latestWeakTopic} earlier, so we can start there.` : 'Pick any topic to begin.'}`,
    topic: latestWeakTopic,
    suggestions: ['Try similar question', 'Give hint', 'Revise topic'],
  });

  if (!initialPrompt) {
    return [intro];
  }

  const seededReply = buildAiReply({
    prompt: initialPrompt,
    mode: 'Learn Mode',
    fallbackTopic: '',
    latestWeakTopic,
  });

  return [
    intro,
    createMessage({ role: 'user', text: initialPrompt }),
    createMessage({ role: 'assistant', ...seededReply }),
  ];
};

const ChatPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { quizHistory, topicPerformance, weakTopics } = useAppState();

  const [mode, setMode] = useState('Learn Mode');
  const [input, setInput] = useState('');
  const seedPrompt = (location.state?.seedPrompt || '').trim();

  const knownTopics = useMemo(() => topicPerformance.map((topic) => topic.topic), [topicPerformance]);
  const latestWeakTopic = useMemo(() => {
    const latestAttempt = quizHistory[0];
    if (latestAttempt?.weakTopics?.length) {
      return latestAttempt.weakTopics[0];
    }
    return weakTopics[0]?.topic || '';
  }, [quizHistory, weakTopics]);

  const [messages, setMessages] = useState(() =>
    buildInitialMessages({
      initialPrompt: seedPrompt,
      latestWeakTopic,
    })
  );

  const inferTopic = useCallback(
    (text) => {
      const lower = text.toLowerCase();
      const topic = knownTopics.find((item) => lower.includes(item.toLowerCase()));
      return topic || '';
    },
    [knownTopics]
  );

  const sendMessage = useCallback(
    (rawText) => {
      const prompt = rawText.trim();
      if (!prompt) {
        return;
      }

      const userMessage = createMessage({ role: 'user', text: prompt });
      const inferredTopic = inferTopic(prompt);
      const ai = buildAiReply({
        prompt,
        mode,
        fallbackTopic: inferredTopic,
        latestWeakTopic,
      });
      const aiMessage = createMessage({ role: 'assistant', ...ai });

      setMessages((prev) => [...prev, userMessage, aiMessage]);
      setInput('');
    },
    [inferTopic, latestWeakTopic, mode]
  );

  const handleSuggestion = (action, topic) => {
    const activeTopic = topic || latestWeakTopic;

    if (action === 'Try similar question') {
      navigate('/quiz', { state: { presetTopic: activeTopic || undefined } });
      return;
    }

    if (action === 'Give hint') {
      const hintMessage = createMessage({
        role: 'assistant',
        text: `${activeTopic ? `${activeTopic}: ` : ''}Break the problem into known formula + known value + one unknown. Solve in that order.`,
        topic: activeTopic,
        suggestions: ['Try similar question', 'Revise topic'],
      });
      setMessages((prev) => [...prev, hintMessage]);
      return;
    }

    navigate('/flashcards', { state: { presetTopic: activeTopic || undefined } });
  };

  return (
    <section className="max-w-5xl mx-auto rounded-3xl border border-primary/15 bg-card/85 backdrop-blur-xl shadow-2xl overflow-hidden">
      <header className="p-5 md:p-6 border-b border-primary/10 bg-background/45">
        <p className="text-xs font-bold uppercase tracking-widest text-secondary-text">AI Chatbot Flow</p>
        <h2 className="text-2xl font-black mt-1">Smart Interaction</h2>
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

      <div className="h-[52vh] overflow-y-auto p-5 md:p-6 space-y-4 bg-gradient-to-b from-transparent to-background/30">
        {messages.map((message) => (
          <article key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 border ${
                message.role === 'user'
                  ? 'bg-primary text-white border-primary/30'
                  : 'bg-background/60 text-primary-text border-primary/15'
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
                      onClick={() => handleSuggestion(item, message.topic)}
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
                sendMessage(input);
              }
            }}
            placeholder="Explain integration / Test me / Explain my mistake"
            className="flex-1 rounded-xl border border-primary/20 bg-background/60 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/60"
          />
          <button
            onClick={() => sendMessage(input)}
            className="w-10 h-10 rounded-xl bg-primary hover:bg-secondary text-white flex items-center justify-center transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </section>
  );
};

export default ChatPage;

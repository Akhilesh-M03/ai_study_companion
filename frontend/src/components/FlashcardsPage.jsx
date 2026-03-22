import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { RotateCcw, ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';

const notesByTopic = {
  Integration: 'Integration is reverse differentiation; always remember + C for indefinite integrals.',
  Trigonometry: 'Anchor identity: sin^2(x) + cos^2(x) = 1. Build all identities around this base.',
  Derivatives: 'Practice chain rule and product rule with 5 mixed examples daily.',
  Kinematics: 'Memorize v=u+at, s=ut+1/2at^2, v^2=u^2+2as with units.',
  Optics: 'Lens sign convention and focal length unit (meter) are common trap points.',
  Organic: 'Map functional groups visually to lock them into long-term memory.',
  Physical: 'pH below 7 acidic, above 7 basic, 7 neutral.',
  Databases: 'SQL = Structured Query Language. Focus on SELECT-WHERE-GROUP BY flow.',
  Algorithms: 'Binary search works on sorted arrays with O(log n) complexity.',
  Waves: 'Frequency means oscillations per second; measured in Hertz.',
};

const FlashcardsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { topicPerformance, weakTopics } = useAppState();

  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const cards = useMemo(() => {
    const focusTopic = location.state?.presetTopic;

    let source = weakTopics.length ? weakTopics : topicPerformance;

    if (focusTopic) {
      const focused = source.find((item) => item.topic === focusTopic);
      const remaining = source.filter((item) => item.topic !== focusTopic);
      source = focused ? [focused, ...remaining] : source;
    }

    return source.slice(0, 8).map((item) => ({
      id: item.topic,
      front: `${item.subject}: ${item.topic}`,
      back: notesByTopic[item.topic] || 'Revise this topic with one concept and one solved example.',
      strength: item.strength,
    }));
  }, [location.state, topicPerformance, weakTopics]);

  const safeIndex = Math.min(index, Math.max(cards.length - 1, 0));
  const current = cards[safeIndex];

  if (!current) {
    return (
      <section className="max-w-3xl mx-auto rounded-3xl border border-primary/15 bg-card/85 backdrop-blur-xl p-8 text-center shadow-2xl">
        <h2 className="text-2xl font-black">No Flashcards Available</h2>
        <p className="text-secondary-text mt-2">Complete a quiz first to generate revision cards.</p>
      </section>
    );
  }

  return (
    <section className="max-w-4xl mx-auto rounded-3xl border border-primary/15 bg-card/85 backdrop-blur-xl p-6 md:p-8 shadow-2xl">
      <p className="text-xs font-bold uppercase tracking-widest text-secondary-text">Revision Flow</p>
      <h2 className="text-3xl font-black mt-2 flex items-center gap-2">
        <Layers className="w-7 h-7 text-primary" />
        Smart Flashcards
      </h2>
      <p className="text-sm text-secondary-text mt-2">Flip through cards generated from your weak topics.</p>

      <div className="mt-7">
        <button
          onClick={() => setFlipped((prev) => !prev)}
          className="w-full min-h-[260px] rounded-3xl border border-primary/20 bg-gradient-to-br from-background/65 to-primary/10 p-6 text-left transition-all duration-300 hover:border-primary/40"
        >
          <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-secondary-text">
            <span>{flipped ? 'Answer' : 'Question'}</span>
            <span>
              Card {safeIndex + 1}/{cards.length}
            </span>
          </div>

          <div className="mt-8">
            {!flipped ? (
              <>
                <p className="text-lg md:text-2xl font-black">{current.front}</p>
                <p className="mt-4 text-sm text-secondary-text">Current proficiency: {current.strength}%</p>
                <p className="mt-8 text-xs font-bold uppercase tracking-wider text-primary">Tap to flip</p>
              </>
            ) : (
              <>
                <p className="text-lg md:text-xl font-semibold leading-relaxed">{current.back}</p>
                <p className="mt-8 text-xs font-bold uppercase tracking-wider text-primary">Tap to flip back</p>
              </>
            )}
          </div>
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          onClick={() => {
            setIndex((prev) => Math.max(0, prev - 1));
            setFlipped(false);
          }}
          disabled={safeIndex === 0}
          className="rounded-xl border border-primary/25 bg-background/55 px-4 py-2.5 text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <button
          onClick={() => {
            setIndex((prev) => Math.min(cards.length - 1, prev + 1));
            setFlipped(false);
          }}
          disabled={safeIndex === cards.length - 1}
          className="rounded-xl border border-primary/25 bg-background/55 px-4 py-2.5 text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            setIndex(0);
            setFlipped(false);
          }}
          className="rounded-xl border border-primary/25 bg-background/55 px-4 py-2.5 text-sm font-bold flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Restart Deck
        </button>

        <button
          onClick={() => navigate('/dashboard')}
          className="rounded-xl bg-primary hover:bg-secondary text-white px-4 py-2.5 text-sm font-bold transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    </section>
  );
};

export default FlashcardsPage;

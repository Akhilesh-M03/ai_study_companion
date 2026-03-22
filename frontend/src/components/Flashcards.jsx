import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle2, Layers } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';

const fallbackWeakTopics = ['Trigonometry', 'Databases', 'Optics', 'Integration', 'Physical'];

const weakTopicFlashcardTemplates = {
  Trigonometry: {
    term: 'Trigonometry Identity Recall',
    explanation:
      'Start from sin^2(x) + cos^2(x) = 1, derive related identities, then solve one transformation problem to lock pattern recognition.',
  },
  Databases: {
    term: 'SQL Query Structuring',
    explanation:
      'Before writing SQL, define output columns, filtering rules, and grouping. Then write SELECT -> FROM -> WHERE -> GROUP BY in order.',
  },
  Optics: {
    term: 'Lens Formula Sign Conventions',
    explanation:
      'Use a fixed sign convention every time. Mark object distance, image distance, and focal length signs before plugging values.',
  },
  Integration: {
    term: 'Integration Method Selection',
    explanation:
      'Classify the integrand first: substitution, parts, or partial fractions. Picking the right method early avoids long algebra mistakes.',
  },
  Physical: {
    term: 'pH and Acid-Base Classification',
    explanation:
      'Anchor this rule: pH < 7 acidic, pH = 7 neutral, pH > 7 basic. Then verify with one quick classification example.',
  },
  Limits: {
    term: 'Limit Simplification Strategy',
    explanation:
      'If direct substitution fails, simplify first (factor, rationalize, or use identities), then re-evaluate the limit step-by-step.',
  },
  Organic: {
    term: 'Functional Group Identification',
    explanation:
      'Scan molecules by priority order of groups. Build one-line cues for each group so recognition becomes automatic in MCQs.',
  },
  Waves: {
    term: 'Frequency and Wavelength Relationship',
    explanation:
      'Use v = f * lambda and keep units consistent. Rearrange only after writing known values and target variable.',
  },
};

const buildFlashcards = (weakTopics) => {
  const weakTopicNames = [...new Set(weakTopics.map((item) => item.topic))];
  const mergedTopics = [...weakTopicNames, ...fallbackWeakTopics.filter((topic) => !weakTopicNames.includes(topic))].slice(0, 5);

  return mergedTopics.map((topic, index) => {
    const template = weakTopicFlashcardTemplates[topic] || {
      term: `${topic} Revision Prompt`,
      explanation: 'Review core formula, solve one guided example, then answer one self-check question.',
    };

    return {
      id: `${topic}-${index}`,
      topic,
      front: template.term,
      back: template.explanation,
    };
  });
};

const Flashcards = () => {
  const navigate = useNavigate();
  const { weakTopics } = useAppState();

  const cards = useMemo(() => buildFlashcards(weakTopics), [weakTopics]);

  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mastered, setMastered] = useState([]);

  const current = cards[index];
  const masteredSet = useMemo(() => new Set(mastered), [mastered]);
  const isCurrentMastered = current ? masteredSet.has(current.id) : false;

  if (!current) {
    return (
      <section className="max-w-3xl mx-auto rounded-3xl border border-primary/15 bg-card/85 backdrop-blur-xl p-8 text-center shadow-2xl">
        <h2 className="text-2xl font-black">No Flashcards Available</h2>
        <p className="text-secondary-text mt-2">Run at least one quiz to generate weak-topic flashcards.</p>
      </section>
    );
  }

  const goPrevious = () => {
    setIndex((prev) => Math.max(0, prev - 1));
    setIsFlipped(false);
  };

  const goNext = () => {
    setIndex((prev) => Math.min(cards.length - 1, prev + 1));
    setIsFlipped(false);
  };

  const markAsMastered = () => {
    if (!masteredSet.has(current.id)) {
      setMastered((prev) => [...prev, current.id]);
    }

    if (index < cards.length - 1) {
      setIndex((prev) => prev + 1);
      setIsFlipped(false);
    }
  };

  return (
    <section className="max-w-5xl mx-auto rounded-3xl border border-primary/15 bg-card/85 backdrop-blur-xl p-6 md:p-8 shadow-2xl">
      <p className="text-xs font-bold uppercase tracking-widest text-secondary-text">Phase 5 • Flashcards</p>
      <h2 className="text-3xl font-black mt-2 flex items-center gap-2">
        <Layers className="w-7 h-7 text-primary" />
        Weak Topic Flashcards
      </h2>
      <p className="text-sm text-secondary-text mt-2">3D flip cards generated from your weakest topics.</p>

      <div className="mt-7 relative h-[340px] [perspective:1400px]">
        <button
          onClick={() => setIsFlipped((prev) => !prev)}
          className={`relative w-full h-full rounded-3xl [transform-style:preserve-3d] transition-transform duration-700 ${
            isFlipped ? '[transform:rotateY(180deg)]' : ''
          }`}
        >
          <article className="absolute inset-0 rounded-3xl border border-primary/20 bg-gradient-to-br from-background/70 to-primary/10 p-6 md:p-8 shadow-xl [backface-visibility:hidden] text-left">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-secondary-text">Front</span>
              <span className="text-xs font-bold text-secondary-text">
                Card {index + 1}/{cards.length}
              </span>
            </div>

            <div className="mt-10">
              <p className="text-xs font-bold uppercase tracking-wider text-primary/90">Weak Topic</p>
              <h3 className="text-2xl md:text-3xl font-black mt-2">{current.topic}</h3>
              <p className="mt-4 text-base md:text-lg font-semibold">{current.front}</p>
            </div>

            <p className="absolute bottom-6 left-6 text-xs font-bold uppercase tracking-wider text-primary">
              Tap to flip
            </p>
          </article>

          <article className="absolute inset-0 rounded-3xl border border-secondary/20 bg-gradient-to-br from-background/70 to-secondary/10 p-6 md:p-8 shadow-xl [backface-visibility:hidden] [transform:rotateY(180deg)] text-left">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-secondary-text">Back</span>
              {isCurrentMastered ? (
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-green-500/15 text-green-400 border border-green-500/30">
                  Mastered
                </span>
              ) : null}
            </div>

            <div className="mt-8">
              <p className="text-xs font-bold uppercase tracking-wider text-secondary">Explanation</p>
              <p className="mt-3 text-base md:text-lg font-medium leading-relaxed">{current.back}</p>
            </div>

            <p className="absolute bottom-6 left-6 text-xs font-bold uppercase tracking-wider text-secondary">
              Tap to flip back
            </p>
          </article>
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={goPrevious}
          disabled={index === 0}
          className="rounded-xl border border-primary/25 bg-background/55 px-4 py-2.5 text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <button
          onClick={goNext}
          disabled={index === cards.length - 1}
          className="rounded-xl border border-primary/25 bg-background/55 px-4 py-2.5 text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          onClick={markAsMastered}
          className="rounded-xl bg-primary hover:bg-secondary text-white px-4 py-2.5 text-sm font-bold transition-colors flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          Mark as Mastered
        </button>

        <button
          onClick={() => navigate('/dashboard')}
          className="rounded-xl border border-primary/25 bg-background/55 px-4 py-2.5 text-sm font-bold"
        >
          Back to Dashboard
        </button>
      </div>

      <p className="mt-4 text-xs text-secondary-text">
        Mastered topics: {mastered.length}/{cards.length}
      </p>
    </section>
  );
};

export default Flashcards;

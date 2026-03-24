import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, CheckCircle2, Layers } from "lucide-react";
import { useAppState } from "../context/AppStateContext";

const fallbackWeakTopics = [
  "Trigonometry",
  "Databases",
  "Optics",
  "Integration",
  "Physical",
];

const weakTopicFlashcardTemplates = {
  Trigonometry: {
    term: "Trigonometry Identity Recall",
    explanation:
      "Start from sin^2(x) + cos^2(x) = 1, derive related identities, then solve one transformation problem to lock pattern recognition.",
  },
  Databases: {
    term: "SQL Query Structuring",
    explanation:
      "Before writing SQL, define output columns, filtering rules, and grouping. Then write SELECT -> FROM -> WHERE -> GROUP BY in order.",
  },
  Optics: {
    term: "Lens Formula Sign Conventions",
    explanation:
      "Use a fixed sign convention every time. Mark object distance, image distance, and focal length signs before plugging values.",
  },
  Integration: {
    term: "Integration Method Selection",
    explanation:
      "Classify the integrand first: substitution, parts, or partial fractions. Picking the right method early avoids long algebra mistakes.",
  },
  Physical: {
    term: "pH and Acid-Base Classification",
    explanation:
      "Anchor this rule: pH < 7 acidic, pH = 7 neutral, pH > 7 basic. Then verify with one quick classification example.",
  },
  Limits: {
    term: "Limit Simplification Strategy",
    explanation:
      "If direct substitution fails, simplify first (factor, rationalize, or use identities), then re-evaluate the limit step-by-step.",
  },
  Organic: {
    term: "Functional Group Identification",
    explanation:
      "Scan molecules by priority order of groups. Build one-line cues for each group so recognition becomes automatic in MCQs.",
  },
  Waves: {
    term: "Frequency and Wavelength Relationship",
    explanation:
      "Use v = f * lambda and keep units consistent. Rearrange only after writing known values and target variable.",
  },
};

const buildFlashcards = (weakTopics, serverRecommendations) => {
  const recommendedTopics = [
    ...new Set(
      (serverRecommendations || []).map((item) => item.topic).filter(Boolean),
    ),
  ];
  const weakTopicNames = [...new Set(weakTopics.map((item) => item.topic))];
  const mergedTopics = [
    ...recommendedTopics,
    ...weakTopicNames,
    ...fallbackWeakTopics.filter(
      (topic) =>
        !weakTopicNames.includes(topic) && !recommendedTopics.includes(topic),
    ),
  ].slice(0, 5);

  return mergedTopics.map((topic, index) => {
    const template = weakTopicFlashcardTemplates[topic] || {
      term: `${topic} Revision Prompt`,
      explanation:
        "Review core formula, solve one guided example, then answer one self-check question.",
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
  const { serverRecommendations, weakTopics } = useAppState();

  const cards = useMemo(
    () => buildFlashcards(weakTopics, serverRecommendations),
    [serverRecommendations, weakTopics],
  );

  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mastered, setMastered] = useState([]);

  const current = cards[index];
  const masteredSet = useMemo(() => new Set(mastered), [mastered]);
  const isCurrentMastered = current ? masteredSet.has(current.id) : false;

  if (!current) {
    return (
      <section className="max-w-3xl mx-auto bg-white border border-slate-200 shadow-sm rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-slate-800">
          No Flashcards Available
        </h2>
        <p className="text-slate-500 mt-2">
          Run at least one quiz to generate weak-topic flashcards.
        </p>
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
    <section className="max-w-5xl mx-auto bg-white border border-slate-200 shadow-sm rounded-2xl p-6 md:p-8">
      <h2 className="text-3xl font-bold flex items-center gap-2 text-slate-800">
        <Layers className="w-7 h-7 text-emerald-600" />
        Weak Topic Flashcards
      </h2>
      <p className="text-sm text-slate-500 mt-2">
        3D flip cards generated from your weakest topics.
      </p>

      <div className="mt-7 relative h-[340px] perspective-[1400px]">
        <button
          onClick={() => setIsFlipped((prev) => !prev)}
          className={`relative w-full h-full rounded-3xl transform-3d transition-transform duration-700 ${
            isFlipped ? "transform-[rotateY(180deg)]" : ""
          }`}
        >
          <article className="absolute inset-0 rounded-3xl border border-slate-200 bg-slate-50 p-6 md:p-8 shadow-sm backface-hidden text-left">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Front
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Card {index + 1}/{cards.length}
              </span>
            </div>

            <div className="mt-10">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Weak Topic
              </p>
              <h3 className="text-2xl md:text-3xl font-bold mt-2 text-slate-800">
                {current.topic}
              </h3>
              <p className="mt-4 text-base md:text-lg font-semibold text-slate-700">
                {current.front}
              </p>
            </div>

            <p className="absolute bottom-6 left-6 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Tap to flip
            </p>
          </article>

          <article className="absolute inset-0 rounded-3xl border border-slate-200 bg-slate-50 p-6 md:p-8 shadow-sm backface-hidden transform-[rotateY(180deg)] text-left">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Back
              </span>
              {isCurrentMastered ? (
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Mastered
                </span>
              ) : null}
            </div>

            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Explanation
              </p>
              <p className="mt-3 text-base md:text-lg font-medium leading-relaxed text-slate-700">
                {current.back}
              </p>
            </div>

            <p className="absolute bottom-6 left-6 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Tap to flip back
            </p>
          </article>
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={goPrevious}
          disabled={index === 0}
          className="rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <button
          onClick={goNext}
          disabled={index === cards.length - 1}
          className="rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          onClick={markAsMastered}
          className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 text-sm font-semibold transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
        >
          <CheckCircle2 className="w-4 h-4" />
          Mark as Mastered
        </button>

        <button
          onClick={() => navigate("/dashboard")}
          className="rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 text-sm font-semibold transition-colors"
        >
          Back to Dashboard
        </button>
      </div>

      <p className="mt-4 text-xs text-slate-500">
        Mastered topics: {mastered.length}/{cards.length}
      </p>
    </section>
  );
};

export default Flashcards;

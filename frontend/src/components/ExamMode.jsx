import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Brain,
  Lightbulb,
  CheckCircle2,
  XCircle,
  MessageSquareText,
  ArrowRight,
  Trophy,
} from 'lucide-react';
import { useAppState } from '../context/AppStateContext';

const questionBank = [
  {
    id: 1,
    topic: 'Integration',
    subject: 'Math',
    difficulty: 'Medium',
    prompt: 'Explain what indefinite integration gives you in one line.',
    hint: 'Think antiderivative + constant.',
    acceptedKeywords: ['antiderivative', 'constant', 'family of functions'],
    explanation: 'Indefinite integration returns the antiderivative plus an arbitrary constant C.',
    mistakeType: 'Concept confusion',
    suggestion: 'Revise derivative-antiderivative pair mapping for 5 minutes.',
  },
  {
    id: 2,
    topic: 'Trigonometry',
    subject: 'Math',
    difficulty: 'Hard',
    prompt: 'What is sin^2(x) + cos^2(x)?',
    hint: 'Fundamental identity.',
    acceptedKeywords: ['1', 'one'],
    explanation: 'The identity sin^2(x) + cos^2(x) = 1 holds for all real x.',
    mistakeType: 'Identity recall gap',
    suggestion: 'Keep a one-page trig identity revision sheet.',
  },
  {
    id: 3,
    topic: 'Derivatives',
    subject: 'Math',
    difficulty: 'Easy',
    prompt: 'Derivative of e^x is?',
    hint: 'Special exponential rule.',
    acceptedKeywords: ['e^x', 'exponential', 'same function'],
    explanation: 'The derivative of e^x is itself, e^x.',
    mistakeType: 'Formula memory slip',
    suggestion: 'Practice 10 speed-derivative drills.',
  },
  {
    id: 4,
    topic: 'Kinematics',
    subject: 'Physics',
    difficulty: 'Medium',
    prompt: 'State the first equation of motion for constant acceleration.',
    hint: 'Relates v, u, a, and t.',
    acceptedKeywords: ['v=u+at', 'u+at', 'velocity'],
    explanation: 'For constant acceleration, v = u + at.',
    mistakeType: 'Equation recall issue',
    suggestion: 'Use flashcards for all 3 equations of motion.',
  },
  {
    id: 5,
    topic: 'Optics',
    subject: 'Physics',
    difficulty: 'Medium',
    prompt: 'What is the SI unit of focal length?',
    hint: 'It is a length quantity.',
    acceptedKeywords: ['meter', 'metre', 'm'],
    explanation: 'Focal length is measured in meters (m).',
    mistakeType: 'Unit confusion',
    suggestion: 'Build a units cheat-sheet by chapter.',
  },
  {
    id: 6,
    topic: 'Organic',
    subject: 'Chemistry',
    difficulty: 'Hard',
    prompt: 'What is the functional group in alcohols?',
    hint: 'Think hydroxyl.',
    acceptedKeywords: ['oh', 'hydroxyl', '-oh'],
    explanation: 'Alcohols contain the hydroxyl functional group (-OH).',
    mistakeType: 'Functional group mismatch',
    suggestion: 'Revise functional groups with visual structures.',
  },
  {
    id: 7,
    topic: 'Physical',
    subject: 'Chemistry',
    difficulty: 'Medium',
    prompt: 'What does pH less than 7 indicate?',
    hint: 'Acid-base scale.',
    acceptedKeywords: ['acid', 'acidic'],
    explanation: 'A pH below 7 indicates an acidic solution.',
    mistakeType: 'Concept reversal',
    suggestion: 'Use anchor values: pH 7 neutral, below acidic, above basic.',
  },
  {
    id: 8,
    topic: 'Databases',
    subject: 'CS',
    difficulty: 'Medium',
    prompt: 'What does SQL stand for?',
    hint: 'Structured ... Language.',
    acceptedKeywords: ['structured query language'],
    explanation: 'SQL stands for Structured Query Language.',
    mistakeType: 'Terminology gap',
    suggestion: 'Memorize key expansion acronyms in CS subjects.',
  },
  {
    id: 9,
    topic: 'Algorithms',
    subject: 'CS',
    difficulty: 'Hard',
    prompt: 'What is the average time complexity of binary search?',
    hint: 'Divide and conquer in sorted arrays.',
    acceptedKeywords: ['log n', 'o(log n)', 'logarithmic'],
    explanation: 'Binary search operates in logarithmic time, O(log n).',
    mistakeType: 'Complexity mismatch',
    suggestion: 'Practice classifying common algorithms by complexity.',
  },
  {
    id: 10,
    topic: 'Waves',
    subject: 'Physics',
    difficulty: 'Easy',
    prompt: 'Define frequency in one sentence.',
    hint: 'Oscillations per second.',
    acceptedKeywords: ['per second', 'hertz', 'oscillation'],
    explanation: 'Frequency is the number of oscillations per second, measured in Hertz.',
    mistakeType: 'Definition gap',
    suggestion: 'Use one-line definitions while revising core physics terms.',
  },
];

const shuffle = (items) => {
  const clone = [...items];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
};

const selectQuestionSet = ({ chosenDifficulty, chosenTopic }) => {
  let pool = questionBank;

  if (chosenTopic) {
    pool = pool.filter((question) => question.topic === chosenTopic);
  }

  if (chosenDifficulty) {
    const difficultyPool = pool.filter((question) => question.difficulty === chosenDifficulty);
    if (difficultyPool.length >= 3) {
      pool = difficultyPool;
    }
  }

  if (pool.length < 3) {
    pool = questionBank;
  }

  return shuffle(pool).slice(0, Math.min(5, pool.length));
};

const ExamMode = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { weakTopics, recordQuizResult } = useAppState();

  const autoWeak = Boolean(location.state?.autoWeak);
  const entryWeakTopic = weakTopics[0]?.topic ?? '';
  const entryTopic = location.state?.presetTopic ?? (autoWeak ? entryWeakTopic : '');
  const entryDifficulty = location.state?.presetDifficulty ?? '';
  const initialQuestionSet = autoWeak
    ? selectQuestionSet({
        chosenDifficulty: entryDifficulty,
        chosenTopic: entryTopic,
      })
    : [];

  const [setup, setSetup] = useState({
    topic: entryTopic,
    difficulty: entryDifficulty,
  });
  const [stage, setStage] = useState(initialQuestionSet.length ? 'question' : 'setup');
  const [activeQuestions, setActiveQuestions] = useState(initialQuestionSet);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState(null);

  const topicOptions = useMemo(() => [...new Set(questionBank.map((item) => item.topic))], []);
  const currentQuestion = activeQuestions[currentIndex];
  const totalQuestions = activeQuestions.length;
  const progress = totalQuestions ? ((currentIndex + 1) / totalQuestions) * 100 : 0;

  const startQuiz = (useWeakTopic = false) => {
    const weakTopic = weakTopics[0]?.topic ?? '';
    const chosenTopic = useWeakTopic ? weakTopic : setup.topic;
    const chosenDifficulty = setup.difficulty;

    const selected = selectQuestionSet({
      chosenDifficulty,
      chosenTopic,
    });

    setActiveQuestions(selected);
    setCurrentIndex(0);
    setAnswer('');
    setShowHint(false);
    setCurrentFeedback(null);
    setResults([]);
    setSummary(null);
    setStage('question');

    if (useWeakTopic && weakTopic) {
      setSetup((prev) => ({ ...prev, topic: weakTopic }));
    }
  };

  const handleSubmitAnswer = () => {
    if (!currentQuestion || !answer.trim()) {
      return;
    }

    const normalizedAnswer = answer.toLowerCase();
    const isCorrect = currentQuestion.acceptedKeywords.some((keyword) =>
      normalizedAnswer.includes(keyword.toLowerCase())
    );

    setCurrentFeedback({ ...currentQuestion, isCorrect });
    setResults((prev) => [
      ...prev,
      {
        topic: currentQuestion.topic,
        subject: currentQuestion.subject,
        isCorrect,
      },
    ]);
    setStage('feedback');
  };

  const handleNext = () => {
    const isLastQuestion = currentIndex >= totalQuestions - 1;

    if (!isLastQuestion) {
      setCurrentIndex((prev) => prev + 1);
      setAnswer('');
      setShowHint(false);
      setCurrentFeedback(null);
      setStage('question');
      return;
    }

    const correctCount = results.filter((item) => item.isCorrect).length;
    const score = Math.round((correctCount / Math.max(results.length, 1)) * 100);
    const weakFromRun = [...new Set(results.filter((item) => !item.isCorrect).map((item) => item.topic))];

    const suggestions = weakFromRun.length
      ? weakFromRun.map((topic) => `Revise ${topic} with flashcards and run a quick quiz.`)
      : ['Great consistency. Increase difficulty and continue the loop.'];

    setSummary({
      score,
      correctCount,
      total: results.length,
      weakFromRun,
      suggestions,
    });

    recordQuizResult({
      results,
      difficulty: setup.difficulty || 'Medium',
      source: autoWeak ? 'Practice Weak Topics' : 'Manual Quiz',
    });

    setStage('summary');
  };

  const askAiWithContext = () => {
    if (!currentFeedback) {
      return;
    }

    navigate('/chat', {
      state: {
        seedPrompt: `I got this wrong in ${currentFeedback.topic}: "${currentFeedback.prompt}". Mistake type: ${currentFeedback.mistakeType}. Explain simply and ask me a follow-up check question.`,
      },
    });
  };

  if (stage === 'setup') {
    return (
      <section className="max-w-4xl mx-auto rounded-3xl border border-primary/15 bg-card/85 backdrop-blur-xl p-6 md:p-8 shadow-2xl">
        <p className="text-xs font-bold uppercase tracking-widest text-secondary-text">Step 1 • Quiz Start</p>
        <h2 className="text-3xl font-black mt-2">Choose Your Quiz Path</h2>
        <p className="text-sm text-secondary-text mt-2">
          Topic and difficulty are optional. Or jump directly into Practice Weak Topics for auto-selection.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-secondary-text">Topic (Optional)</label>
            <select
              value={setup.topic}
              onChange={(e) => setSetup((prev) => ({ ...prev, topic: e.target.value }))}
              className="mt-2 w-full rounded-xl border border-primary/20 bg-background/60 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/60"
            >
              <option value="">All Topics</option>
              {topicOptions.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-secondary-text">Difficulty (Optional)</label>
            <select
              value={setup.difficulty}
              onChange={(e) => setSetup((prev) => ({ ...prev, difficulty: e.target.value }))}
              className="mt-2 w-full rounded-xl border border-primary/20 bg-background/60 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/60"
            >
              <option value="">Mixed</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-7">
          <button
            onClick={() => startQuiz(false)}
            className="rounded-xl bg-primary hover:bg-secondary text-white py-3 font-bold transition-all duration-300 shadow-[0_0_20px_var(--color-primary)]"
          >
            Start Quiz
          </button>
          <button
            onClick={() => startQuiz(true)}
            className="rounded-xl border border-primary/25 bg-background/50 hover:bg-primary/10 py-3 font-bold transition-all duration-300"
          >
            Practice Weak Topics
          </button>
        </div>
      </section>
    );
  }

  if (stage === 'summary' && summary) {
    return (
      <section className="max-w-4xl mx-auto rounded-3xl border border-primary/15 bg-card/85 backdrop-blur-xl p-6 md:p-8 shadow-2xl space-y-6">
        <p className="text-xs font-bold uppercase tracking-widest text-secondary-text">Step 5 • Quiz Summary</p>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-black">Score: {summary.score}%</h2>
            <p className="text-sm text-secondary-text">
              {summary.correctCount}/{summary.total} correct answers
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <article className="rounded-2xl border border-primary/15 bg-background/50 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-secondary-text">Weak Topics</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {summary.weakFromRun.length ? (
                summary.weakFromRun.map((topic) => (
                  <span key={topic} className="px-2.5 py-1 rounded-full bg-red-500/15 text-red-400 text-xs font-bold">
                    {topic}
                  </span>
                ))
              ) : (
                <span className="text-sm text-green-400 font-semibold">No weak topics in this run.</span>
              )}
            </div>
          </article>

          <article className="rounded-2xl border border-primary/15 bg-background/50 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-secondary-text">Suggestions</p>
            <ul className="mt-2 space-y-2">
              {summary.suggestions.map((item) => (
                <li key={item} className="text-sm text-primary-text">
                  • {item}
                </li>
              ))}
            </ul>
          </article>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="rounded-xl bg-primary hover:bg-secondary text-white px-5 py-3 font-bold transition-all duration-300"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate('/flashcards')}
            className="rounded-xl border border-primary/25 bg-background/50 hover:bg-primary/10 px-5 py-3 font-bold transition-all duration-300"
          >
            Revise with Flashcards
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-4xl mx-auto rounded-3xl border border-primary/15 bg-card/85 backdrop-blur-xl p-6 md:p-8 shadow-2xl space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-secondary-text">Step 2 • Question Screen</p>
        <h2 className="text-2xl md:text-3xl font-black mt-2">{currentQuestion.topic}</h2>
        <div className="flex flex-wrap items-center gap-2 mt-3 text-xs font-bold">
          <span className="px-2.5 py-1 rounded-full bg-primary/20 text-primary">Topic: {currentQuestion.topic}</span>
          <span className="px-2.5 py-1 rounded-full bg-secondary/20 text-secondary">Difficulty: {currentQuestion.difficulty}</span>
          <span className="px-2.5 py-1 rounded-full bg-accent/20 text-accent">
            Question {currentIndex + 1}/{totalQuestions}
          </span>
        </div>
      </div>

      <div className="h-2 rounded-full bg-background/60 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-primary to-secondary transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <article className="rounded-2xl border border-primary/15 bg-background/50 p-4">
        <p className="text-base md:text-lg font-semibold leading-relaxed">{currentQuestion.prompt}</p>
      </article>

      {stage === 'question' ? (
        <>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full min-h-[120px] rounded-2xl border border-primary/20 bg-background/55 p-4 text-sm outline-none focus:ring-2 focus:ring-primary/60"
          />

          {showHint ? (
            <div className="rounded-2xl border border-secondary/25 bg-secondary/10 px-4 py-3 text-sm text-primary-text flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-secondary mt-0.5" />
              {currentQuestion.hint}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowHint(true)}
              className="rounded-xl border border-secondary/30 bg-background/50 hover:bg-secondary/10 px-4 py-2.5 text-sm font-bold transition-all duration-300"
            >
              Hint
            </button>
            <button
              onClick={handleSubmitAnswer}
              className="rounded-xl bg-primary hover:bg-secondary text-white px-5 py-2.5 text-sm font-bold transition-all duration-300"
            >
              Submit
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="rounded-2xl border border-primary/15 bg-background/55 p-4 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-secondary-text">Step 3 • Feedback</p>
            <div className="flex items-center gap-2 font-black text-lg">
              {currentFeedback.isCorrect ? (
                <>
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                  <span className="text-green-400">Correct</span>
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 text-red-400" />
                  <span className="text-red-400">Needs Work</span>
                </>
              )}
            </div>

            <div className="text-sm text-primary-text">
              <p>
                <span className="font-bold">Explanation:</span> {currentFeedback.explanation}
              </p>
              <p className="mt-2">
                <span className="font-bold">Mistake type:</span> {currentFeedback.mistakeType}
              </p>
              <p className="mt-2">
                <span className="font-bold">Suggestion:</span> {currentFeedback.suggestion}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleNext}
              className="rounded-xl bg-primary hover:bg-secondary text-white px-5 py-2.5 text-sm font-bold transition-all duration-300 flex items-center gap-2"
            >
              {currentIndex < totalQuestions - 1 ? 'Next Question' : 'View Summary'}
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={askAiWithContext}
              className="rounded-xl border border-primary/25 bg-background/50 hover:bg-primary/10 px-5 py-2.5 text-sm font-bold transition-all duration-300 flex items-center gap-2"
            >
              <MessageSquareText className="w-4 h-4" />
              Ask AI
            </button>
          </div>
        </>
      )}

      <div className="rounded-2xl border border-primary/10 bg-background/45 p-3 text-xs text-secondary-text flex items-start gap-2">
        <Brain className="w-4 h-4 text-primary mt-0.5" />
        Step 4 loop is active: complete 3-5 questions to trigger summary and dashboard learning updates.
      </div>
    </section>
  );
};

export default ExamMode;

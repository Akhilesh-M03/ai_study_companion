import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Lightbulb,
  MessageSquareText,
  Sparkles,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { useAppState } from "../context/AppStateContext";

const dummyQuestions = [
  {
    id: "q-oose-1",
    subject: "Software Engineering",
    topic: "OOSE",
    difficulty: "Medium",
    prompt:
      "Which UML diagram is best for showing object interactions over time in a use case?",
    options: [
      "Class Diagram",
      "Sequence Diagram",
      "State Diagram",
      "Deployment Diagram",
    ],
    correctIndex: 1,
    hint: "Think of time-ordered message flow between objects.",
    explanation:
      "A Sequence Diagram models interactions between objects in chronological order.",
    mistakeType: "Model selection confusion",
    suggestion:
      "Map each UML diagram to its purpose before solving scenario-based questions.",
  },
  {
    id: "q-ml-1",
    subject: "Artificial Intelligence",
    topic: "Machine Learning",
    difficulty: "Easy",
    prompt: "Why do we split data into training and test sets?",
    options: [
      "To reduce file size",
      "To evaluate generalization on unseen data",
      "To speed up GPU inference",
      "To avoid feature scaling",
    ],
    correctIndex: 1,
    hint: "The goal is to check performance on data the model did not see while training.",
    explanation:
      "A held-out test set estimates how well a model generalizes to unseen examples.",
    mistakeType: "Evaluation concept gap",
    suggestion:
      "Remember: training learns, validation tunes, test verifies generalization.",
  },
  {
    id: "q-ml-2",
    subject: "Artificial Intelligence",
    topic: "Machine Learning",
    difficulty: "Hard",
    prompt:
      "Which technique is most directly used to reduce overfitting in a neural network?",
    options: [
      "Increasing training epochs only",
      "Removing normalization",
      "Dropout regularization",
      "Using larger batch size only",
    ],
    correctIndex: 2,
    hint: "It randomly drops neurons during training.",
    explanation:
      "Dropout acts as regularization by preventing co-adaptation of neurons.",
    mistakeType: "Regularization strategy mismatch",
    suggestion:
      "Link each overfitting symptom to a concrete regularization method.",
  },
];

const topicOptions = ["All", "OOSE", "Machine Learning"];
const getAutoTopic = (weakTopics) => {
  const hasMathOrCSWeakness = weakTopics.some(
    (item) => item.subject === "Math" || item.subject === "CS",
  );
  return hasMathOrCSWeakness ? "Machine Learning" : "OOSE";
};

const buildOrderedQuestions = (selectedTopic, selectedDifficulty) => {
  return [...dummyQuestions].sort((a, b) => {
    const scoreA =
      (selectedTopic !== "All" && a.topic === selectedTopic ? 2 : 0) +
      (selectedDifficulty !== "All" && a.difficulty === selectedDifficulty
        ? 1
        : 0);
    const scoreB =
      (selectedTopic !== "All" && b.topic === selectedTopic ? 2 : 0) +
      (selectedDifficulty !== "All" && b.difficulty === selectedDifficulty
        ? 1
        : 0);
    return scoreB - scoreA;
  });
};

const Quiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { weakTopics, recordQuizResult } = useAppState();

  const autoStart = Boolean(location.state?.autoWeak);
  const initialTopic = autoStart ? getAutoTopic(weakTopics) : "All";
  const initialDifficulty = autoStart ? "Medium" : "All";
  const initialQuestions = autoStart
    ? buildOrderedQuestions(initialTopic, initialDifficulty)
    : [];

  const [phase, setPhase] = useState(autoStart ? "question" : "setup");
  const [selectedTopic, setSelectedTopic] = useState(initialTopic);
  const [selectedDifficulty, setSelectedDifficulty] =
    useState(initialDifficulty);
  const [quizQuestions, setQuizQuestions] = useState(initialQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [sourceLabel, setSourceLabel] = useState(
    autoStart ? "Practice Weak Topics" : "Manual Quiz",
  );
  const [attempts, setAttempts] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [summary, setSummary] = useState(null);

  const currentQuestion = quizQuestions[currentIndex];

  const progress = useMemo(() => {
    if (!quizQuestions.length) {
      return 0;
    }
    return ((currentIndex + 1) / quizQuestions.length) * 100;
  }, [currentIndex, quizQuestions.length]);

  const cardClass =
    "relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-[0_16px_45px_rgba(15,23,42,0.1)] backdrop-blur-sm md:p-8";
  const primaryButton =
    "rounded-xl px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-[0_0_15px_rgba(16,185,129,0.35)] transition-all";
  const ghostButton =
    "rounded-xl border border-slate-200 bg-slate-50 hover:bg-white px-5 py-3 font-semibold text-slate-800 transition-colors";

  const startQuiz = (isAuto) => {
    const topic = isAuto ? getAutoTopic(weakTopics) : selectedTopic;
    const difficulty = isAuto ? "Medium" : selectedDifficulty;
    const ordered = buildOrderedQuestions(topic, difficulty);

    setSelectedTopic(topic);
    setSelectedDifficulty(difficulty);
    setQuizQuestions(ordered);
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowHint(false);
    setAttempts([]);
    setFeedback(null);
    setSummary(null);
    setSourceLabel(isAuto ? "Practice Weak Topics" : "Manual Quiz");
    setPhase("question");
  };

  const submitAnswer = () => {
    if (selectedOption === null || !currentQuestion) {
      return;
    }

    const isCorrect = selectedOption === currentQuestion.correctIndex;
    const nextAttempt = {
      questionId: currentQuestion.id,
      topic: currentQuestion.topic,
      subject: currentQuestion.subject,
      isCorrect,
    };

    setAttempts((prev) => [...prev, nextAttempt]);
    setFeedback({
      ...currentQuestion,
      selectedOption,
      isCorrect,
    });
    setPhase("feedback");
  };

  const askAi = () => {
    if (!feedback) {
      return;
    }

    const selectedAnswerText =
      feedback.options[feedback.selectedOption] || "No answer";
    const prompt = `I answered "${selectedAnswerText}" for this question: "${feedback.prompt}". It was ${
      feedback.isCorrect ? "correct" : "incorrect"
    }. Explain this in simple steps and ask me one follow-up check question.`;

    navigate("/chat", { state: { seedPrompt: prompt } });
  };

  const nextQuestion = () => {
    const isLast = currentIndex === quizQuestions.length - 1;

    if (!isLast) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowHint(false);
      setFeedback(null);
      setPhase("question");
      return;
    }

    const correct = attempts.filter((item) => item.isCorrect).length;
    const total = attempts.length;
    const score = Math.round((correct / Math.max(total, 1)) * 100);
    const weakFromQuiz = [
      ...new Set(
        attempts.filter((item) => !item.isCorrect).map((item) => item.topic),
      ),
    ];

    recordQuizResult({
      results: attempts,
      difficulty: selectedDifficulty === "All" ? "Medium" : selectedDifficulty,
      source: sourceLabel,
    });

    setSummary({ score, correct, total, weakFromQuiz });
    setPhase("summary");
  };

  if (phase === "setup") {
    return (
      <section className="max-w-5xl mx-auto space-y-4">
        <div className={cardClass}>
          <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-emerald-100/60 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-cyan-100/60 blur-3xl" />
          <div className="relative">
            <h2 className="text-3xl font-bold mt-2 text-slate-900">
              Quiz Core Loop
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Select topic and difficulty, or auto-generate from weakness
              signals.
            </p>

            <div className="grid grid-cols-1 gap-4 mt-6">
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Topic
                </label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {topicOptions.map((topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-7">
              <button
                onClick={() => startQuiz(false)}
                className={primaryButton}
              >
                Start Quiz
              </button>
              <button
                onClick={() => startQuiz(true)}
                className="rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700 px-5 py-3 font-semibold hover:bg-white transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Auto-generate based on weaknesses
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (phase === "summary" && summary) {
    return (
      <section className="max-w-4xl mx-auto space-y-6">
        <div className={cardClass}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Phase 3 • Summary State
          </p>
          <h2 className="text-3xl font-bold text-slate-900">Quiz Complete</h2>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 mt-4">
            <p className="text-sm text-slate-500">Final Score</p>
            <p className="text-4xl font-bold mt-1 text-slate-900">
              {summary.score}%
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {summary.correct}/{summary.total} correct answers
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 mt-4">
            <p className="text-sm font-semibold text-slate-800">
              Identified Weak Topics
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {summary.weakFromQuiz.length ? (
                summary.weakFromQuiz.map((topic) => (
                  <span
                    key={topic}
                    className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold"
                  >
                    {topic}
                  </span>
                ))
              ) : (
                <span className="text-sm text-emerald-700 font-semibold">
                  No weak topics in this run.
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className={`${primaryButton} mt-4`}
          >
            Back to Dashboard
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-5xl mx-auto space-y-6">
      <div className={cardClass}>
        <div className="pointer-events-none absolute -top-20 -left-20 h-56 w-56 rounded-full bg-emerald-100/50 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-24 h-64 w-64 rounded-full bg-teal-100/50 blur-3xl" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Phase 3 •{" "}
            {phase === "question" ? "Question State" : "Feedback State"}
          </p>

          <div className="h-2 rounded-full bg-slate-100 overflow-hidden mt-4">
            <div
              className="h-2 bg-linear-to-r from-emerald-500 to-emerald-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-semibold mt-4">
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
              Topic: {currentQuestion.topic}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              Difficulty: {currentQuestion.difficulty}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              Q{currentIndex + 1}/{quizQuestions.length}
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-linear-to-br from-slate-50 to-white p-5 shadow-inner md:p-6 mt-5">
            <p className="text-xl md:text-2xl font-bold leading-relaxed text-slate-900">
              {currentQuestion.prompt}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedOption === index;
              const isCorrectOption =
                feedback && index === feedback.correctIndex;
              const isIncorrectSelection =
                feedback && isSelected && !feedback.isCorrect;

              return (
                <button
                  key={option}
                  onClick={() =>
                    phase === "question" && setSelectedOption(index)
                  }
                  disabled={phase === "feedback"}
                  className={`text-left rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                    phase === "question"
                      ? isSelected
                        ? "border-emerald-400 bg-emerald-50"
                        : "border-slate-200 bg-white hover:border-emerald-300"
                      : isCorrectOption
                        ? "border-emerald-300 bg-emerald-50"
                        : isIncorrectSelection
                          ? "border-red-200 bg-red-50"
                          : "border-slate-200 bg-slate-50 opacity-70"
                  }`}
                >
                  <span className="text-xs font-black text-slate-500 mr-2">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-3 mt-5">
            {phase === "question" ? (
              <>
                <button
                  onClick={submitAnswer}
                  disabled={selectedOption === null}
                  className={`${primaryButton} disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
                >
                  Submit Answer
                </button>
                <button
                  onClick={() => setShowHint((prev) => !prev)}
                  className={ghostButton}
                >
                  <Lightbulb className="w-4 h-4 inline-block mr-2" />
                  {showHint ? "Hide Hint" : "Show Hint"}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={nextQuestion}
                  className={`${primaryButton} flex items-center gap-2`}
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={askAi} className={ghostButton}>
                  <MessageSquareText className="w-4 h-4 inline-block mr-2" />
                  Ask AI to explain
                </button>

                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${feedback?.isCorrect ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}
                >
                  {feedback?.isCorrect ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  <span className="text-sm font-semibold">
                    {feedback?.isCorrect ? "Correct" : "Review this"}
                  </span>
                </div>
              </>
            )}
          </div>

          {showHint && phase === "question" && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 mt-4">
              <p className="font-semibold text-emerald-700 mb-1">Hint</p>
              <p>{currentQuestion.hint}</p>
            </div>
          )}

          {phase === "feedback" && feedback && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2 mt-4">
              <p className="text-sm font-semibold text-slate-800">
                Explanation
              </p>
              <p className="text-sm text-slate-700">{feedback.explanation}</p>
              <p className="text-sm font-semibold text-slate-800 mt-3">
                Common Mistake
              </p>
              <p className="text-sm text-slate-700">{feedback.mistakeType}</p>
              <p className="text-sm font-semibold text-slate-800 mt-3">
                Suggestion
              </p>
              <p className="text-sm text-slate-700">{feedback.suggestion}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Quiz;

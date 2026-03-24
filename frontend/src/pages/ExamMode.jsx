import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Brain, CheckCircle2, Sparkles } from "lucide-react";
import { useAppState } from "../context/AppStateContext";
import { generateQuizQuestions } from "../services/quizApi";
import { storeMemoryBatch } from "../services/memoryApi";

const toDisplayDifficulty = (value) => {
  if (!value) {
    return "Medium";
  }

  return `${value.charAt(0).toUpperCase()}${value.slice(1).toLowerCase()}`;
};

const toDifficultyEnum = (value) => (value ? value.toLowerCase() : "medium");

const slideVariants = {
  initial: (direction) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0,
  }),
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: (direction) => ({
    x: direction > 0 ? -40 : 40,
    opacity: 0,
    transition: { duration: 0.2, ease: "easeIn" },
  }),
};

const ExamMode = () => {
  const MotionDiv = motion.div;
  const MotionArticle = motion.article;
  const {
    authToken,
    recordQuizResult,
    refreshLearningInsights,
    serverSyllabusTopics,
    topicPerformance,
    userName,
    weakTopics,
  } = useAppState();

  const defaultTopic =
    weakTopics[0]?.topic ||
    serverSyllabusTopics[0] ||
    topicPerformance[0]?.topic ||
    "Algorithms";

  const topicOptions = useMemo(() => {
    const merged = [
      ...serverSyllabusTopics,
      ...topicPerformance.map((item) => item.topic),
      "Algorithms",
      "Data Structures",
      "Databases",
    ].filter(Boolean);
    return [...new Set(merged)].slice(0, 25);
  }, [serverSyllabusTopics, topicPerformance]);

  const [selectedTopic, setSelectedTopic] = useState(defaultTopic);
  const [selectedDifficulty, setSelectedDifficulty] = useState("medium");
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [selectedMap, setSelectedMap] = useState({});
  const [direction, setDirection] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const total = questions.length;
  const question = questions[index];
  const selectedIndex = question ? selectedMap[question.id] : undefined;
  const hasAnswered = selectedIndex !== undefined;
  const isCorrect =
    question && hasAnswered && selectedIndex === question.correctIndex;

  const progress = useMemo(() => ((index + 1) / total) * 100, [index, total]);

  const score = Object.entries(selectedMap).reduce((acc, [id, answerIndex]) => {
    const current = questions.find((item) => item.id === id);
    if (!current) return acc;
    return acc + (current.correctIndex === answerIndex ? 1 : 0);
  }, 0);

  const generateExam = async () => {
    if (!userName || !authToken) {
      setErrorMessage("Please sign in again to start exam mode.");
      return;
    }

    setIsGenerating(true);
    setErrorMessage("");
    try {
      const response = await generateQuizQuestions({
        topic: selectedTopic,
        difficulty: selectedDifficulty,
        userId: userName,
        useRecommendations: true,
      });

      const mapped = (response?.questions || []).map((item, idx) => ({
        id: `exam-${Date.now()}-${idx}`,
        category: response?.topic || selectedTopic,
        prompt: item.question,
        options: item.options,
        correctIndex: item.correct_option_index,
        explanation: item.explanation,
        difficulty: toDisplayDifficulty(
          response?.difficulty || selectedDifficulty,
        ),
      }));

      if (!mapped.length) {
        throw new Error("No questions received from the exam generator.");
      }

      setQuestions(mapped);
      setIndex(0);
      setSelectedMap({});
      setDirection(1);
    } catch (error) {
      setErrorMessage(
        typeof error?.message === "string"
          ? error.message
          : "Unable to generate exam questions right now.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const selectOption = (optionIndex) => {
    if (!question) return;
    if (selectedMap[question.id] !== undefined) return;
    setSelectedMap((prev) => ({ ...prev, [question.id]: optionIndex }));
  };

  const goNext = () => {
    if (index >= total - 1) return;
    setDirection(1);
    setIndex((prev) => prev + 1);
  };

  const goPrevious = () => {
    if (index <= 0) return;
    setDirection(-1);
    setIndex((prev) => prev - 1);
  };

  const syncExamResults = async () => {
    if (!questions.length || !userName || !authToken) {
      return;
    }

    const attempts = questions.map((item) => {
      const chosenIndex = selectedMap[item.id];
      const selectedAnswer =
        chosenIndex === undefined ? "No answer" : item.options[chosenIndex];
      const isCorrectAnswer = chosenIndex === item.correctIndex;
      return {
        questionId: item.id,
        topic: item.category,
        isCorrect: isCorrectAnswer,
        selectedAnswer,
        correctAnswer: item.options[item.correctIndex],
      };
    });

    recordQuizResult({
      results: attempts,
      difficulty: toDisplayDifficulty(selectedDifficulty),
      source: "Exam Mode",
    });

    setIsSaving(true);
    try {
      await storeMemoryBatch({
        userId: userName,
        token: authToken,
        attempts: attempts.map((item) => ({
          topic: item.topic,
          mistake_type: item.isCorrect ? "Careless" : "Conceptual",
          difficulty: toDisplayDifficulty(selectedDifficulty),
          score: item.isCorrect ? 100 : 0,
          question_id: item.questionId,
          source: "quiz",
          user_answer: item.selectedAnswer,
          correct_answer: item.correctAnswer,
        })),
      });
      await refreshLearningInsights(userName, authToken);
    } catch (error) {
      setErrorMessage(
        typeof error?.message === "string"
          ? `Exam finished but sync failed: ${error.message}`
          : "Exam finished but sync failed.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const answeredCount = Object.keys(selectedMap).length;

  const isExamComplete = total > 0 && answeredCount === total;

  return (
    <div className="bg-slate-50 min-h-full">
      <section className="max-w-4xl mx-auto bg-white border border-slate-200 shadow-sm rounded-2xl p-6 md:p-8">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
              Adaptive Concept Check
            </h2>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Progress</p>
            <p className="text-sm font-semibold text-slate-800">
              {total ? `${index + 1}/${total}` : "0/0"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
          <select
            value={selectedTopic}
            onChange={(event) => setSelectedTopic(event.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500/35 focus:border-emerald-500"
            disabled={isGenerating || total > 0}
          >
            {topicOptions.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>

          <select
            value={selectedDifficulty}
            onChange={(event) =>
              setSelectedDifficulty(toDifficultyEnum(event.target.value))
            }
            className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500/35 focus:border-emerald-500"
            disabled={isGenerating || total > 0}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <button
            onClick={generateExam}
            disabled={isGenerating || !selectedTopic || total > 0}
            className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-40"
          >
            {isGenerating ? "Generating..." : "Start Exam"}
          </button>
        </div>

        {errorMessage ? (
          <p className="text-sm font-semibold text-rose-600 mb-4">
            {errorMessage}
          </p>
        ) : null}

        {!total ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <p className="text-sm text-slate-600">
              Generate an adaptive exam to begin. Each exam includes 2
              high-signal questions.
            </p>
          </div>
        ) : null}

        {total ? (
          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden mb-6">
            <MotionDiv
              className="h-full bg-emerald-500"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            />
          </div>
        ) : null}

        {total ? (
          <div className="relative min-h-90">
            <AnimatePresence mode="wait" custom={direction}>
              <MotionArticle
                key={question.id}
                custom={direction}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-5"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                    {question.category}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                    <Brain className="w-3.5 h-3.5" />
                    {question.difficulty} difficulty
                  </span>
                </div>

                <h3 className="text-xl md:text-2xl font-semibold text-slate-800 leading-snug">
                  {question.prompt}
                </h3>

                <div className="grid grid-cols-1 gap-3">
                  {question.options.map((option, optionIndex) => {
                    const isSelected = selectedIndex === optionIndex;
                    const isAnswer = question.correctIndex === optionIndex;

                    let optionClass =
                      "border-slate-200 bg-white text-slate-700 hover:bg-slate-50";

                    if (hasAnswered && isAnswer) {
                      optionClass =
                        "border-emerald-300 bg-emerald-50 text-emerald-800";
                    } else if (hasAnswered && isSelected && !isAnswer) {
                      optionClass = "border-rose-300 bg-rose-50 text-rose-700";
                    }

                    return (
                      <button
                        key={option}
                        onClick={() => selectOption(optionIndex)}
                        className={`w-full text-left rounded-xl border px-4 py-3.5 transition-colors ${optionClass}`}
                      >
                        <span className="text-sm md:text-base font-medium">
                          {option}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {hasAnswered ? (
                    <motion.div
                      key="explanation"
                      initial={{ opacity: 0, y: 8, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -4, height: 0 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4"
                    >
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 mt-0.5 text-emerald-700" />
                        <div>
                          <p className="text-sm font-semibold text-emerald-800">
                            {isCorrect ? "Great pick" : "AI Explanation"}
                          </p>
                          <p className="text-sm text-slate-700 mt-1 leading-relaxed">
                            {question.explanation}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </MotionArticle>
            </AnimatePresence>
          </div>
        ) : null}

        {total ? (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-slate-500">
              Answered {answeredCount}/{total} · Score {score}/{total}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={goPrevious}
                disabled={index === 0}
                className="rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-40"
              >
                Previous
              </button>
              <button
                onClick={goNext}
                disabled={index === total - 1}
                className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-40"
              >
                Next Question
              </button>
            </div>
          </div>
        ) : null}

        {total && index === total - 1 ? (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-700">
              Final score preview:{" "}
              <span className="font-semibold">
                {score}/{total}
              </span>
            </p>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Review complete
              </span>
              <button
                onClick={syncExamResults}
                disabled={!isExamComplete || isSaving}
                className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 text-xs font-semibold transition-colors disabled:opacity-40"
              >
                {isSaving ? "Syncing..." : "Submit Exam"}
              </button>
              <button
                onClick={() => {
                  setQuestions([]);
                  setSelectedMap({});
                  setIndex(0);
                  setDirection(1);
                }}
                className="rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 px-4 py-2 text-xs font-semibold transition-colors"
              >
                New Exam
              </button>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
};

export default ExamMode;

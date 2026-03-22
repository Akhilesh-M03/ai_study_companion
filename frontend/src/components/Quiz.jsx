import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Lightbulb,
  MessageSquareText,
  Sparkles,
  XCircle,
  ArrowRight,
  Brain,
} from 'lucide-react';
import { useAppState } from '../context/AppStateContext';

const dummyQuestions = [
  {
    id: 'q-oose-1',
    subject: 'Software Engineering',
    topic: 'OOSE',
    difficulty: 'Medium',
    prompt: 'Which UML diagram is best for showing object interactions over time in a use case?',
    options: ['Class Diagram', 'Sequence Diagram', 'State Diagram', 'Deployment Diagram'],
    correctIndex: 1,
    hint: 'Think of time-ordered message flow between objects.',
    explanation: 'A Sequence Diagram models interactions between objects in chronological order.',
    mistakeType: 'Model selection confusion',
    suggestion: 'Map each UML diagram to its purpose before solving scenario-based questions.',
  },
  {
    id: 'q-ml-1',
    subject: 'Artificial Intelligence',
    topic: 'Machine Learning',
    difficulty: 'Easy',
    prompt: 'Why do we split data into training and test sets?',
    options: [
      'To reduce file size',
      'To evaluate generalization on unseen data',
      'To speed up GPU inference',
      'To avoid feature scaling',
    ],
    correctIndex: 1,
    hint: 'The goal is to check performance on data the model did not see while training.',
    explanation: 'A held-out test set estimates how well a model generalizes to unseen examples.',
    mistakeType: 'Evaluation concept gap',
    suggestion: 'Remember: training learns, validation tunes, test verifies generalization.',
  },
  {
    id: 'q-ml-2',
    subject: 'Artificial Intelligence',
    topic: 'Machine Learning',
    difficulty: 'Hard',
    prompt: 'Which technique is most directly used to reduce overfitting in a neural network?',
    options: ['Increasing training epochs only', 'Removing normalization', 'Dropout regularization', 'Using larger batch size only'],
    correctIndex: 2,
    hint: 'It randomly drops neurons during training.',
    explanation: 'Dropout acts as regularization by preventing co-adaptation of neurons.',
    mistakeType: 'Regularization strategy mismatch',
    suggestion: 'Link each overfitting symptom to a concrete regularization method.',
  },
];

const topicOptions = ['All', 'OOSE', 'Machine Learning'];
const difficultyOptions = ['All', 'Easy', 'Medium', 'Hard'];

const getAutoTopic = (weakTopics) => {
  const hasMathOrCSWeakness = weakTopics.some((item) => item.subject === 'Math' || item.subject === 'CS');
  return hasMathOrCSWeakness ? 'Machine Learning' : 'OOSE';
};

const buildOrderedQuestions = (selectedTopic, selectedDifficulty) => {
  return [...dummyQuestions].sort((a, b) => {
    const scoreA = (selectedTopic !== 'All' && a.topic === selectedTopic ? 2 : 0) +
      (selectedDifficulty !== 'All' && a.difficulty === selectedDifficulty ? 1 : 0);
    const scoreB = (selectedTopic !== 'All' && b.topic === selectedTopic ? 2 : 0) +
      (selectedDifficulty !== 'All' && b.difficulty === selectedDifficulty ? 1 : 0);
    return scoreB - scoreA;
  });
};

const Quiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { weakTopics, recordQuizResult } = useAppState();

  const autoStart = Boolean(location.state?.autoWeak);
  const initialTopic = autoStart ? getAutoTopic(weakTopics) : 'All';
  const initialDifficulty = autoStart ? 'Medium' : 'All';
  const initialQuestions = autoStart ? buildOrderedQuestions(initialTopic, initialDifficulty) : [];

  const [phase, setPhase] = useState(autoStart ? 'question' : 'setup');
  const [selectedTopic, setSelectedTopic] = useState(initialTopic);
  const [selectedDifficulty, setSelectedDifficulty] = useState(initialDifficulty);
  const [quizQuestions, setQuizQuestions] = useState(initialQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [sourceLabel, setSourceLabel] = useState(autoStart ? 'Practice Weak Topics' : 'Manual Quiz');
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

  const startQuiz = (isAuto) => {
    const topic = isAuto ? getAutoTopic(weakTopics) : selectedTopic;
    const difficulty = isAuto ? 'Medium' : selectedDifficulty;
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
    setSourceLabel(isAuto ? 'Practice Weak Topics' : 'Manual Quiz');
    setPhase('question');
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
    setPhase('feedback');
  };

  const askAi = () => {
    if (!feedback) {
      return;
    }

    const selectedAnswerText = feedback.options[feedback.selectedOption] || 'No answer';
    const prompt = `I answered "${selectedAnswerText}" for this question: "${feedback.prompt}". It was ${
      feedback.isCorrect ? 'correct' : 'incorrect'
    }. Explain this in simple steps and ask me one follow-up check question.`;

    navigate('/chat', { state: { seedPrompt: prompt } });
  };

  const nextQuestion = () => {
    const isLast = currentIndex === quizQuestions.length - 1;

    if (!isLast) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowHint(false);
      setFeedback(null);
      setPhase('question');
      return;
    }

    const correct = attempts.filter((item) => item.isCorrect).length;
    const total = attempts.length;
    const score = Math.round((correct / Math.max(total, 1)) * 100);
    const weakFromQuiz = [...new Set(attempts.filter((item) => !item.isCorrect).map((item) => item.topic))];

    recordQuizResult({
      results: attempts,
      difficulty: selectedDifficulty === 'All' ? 'Medium' : selectedDifficulty,
      source: sourceLabel,
    });

    setSummary({ score, correct, total, weakFromQuiz });
    setPhase('summary');
  };

  if (phase === 'setup') {
    return (
      <section className="max-w-5xl mx-auto rounded-3xl border border-primary/20 bg-card/85 backdrop-blur-xl p-6 md:p-8 shadow-2xl">
        <p className="text-xs font-bold uppercase tracking-widest text-secondary-text">Phase 3 • Initial State</p>
        <h2 className="text-3xl font-black mt-2">Quiz Core Loop</h2>
        <p className="text-sm text-secondary-text mt-2">Select Topic and Difficulty, or auto-generate from weakness signals.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-secondary-text">Topic</label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="mt-2 w-full rounded-xl border border-primary/20 bg-background/60 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/60"
            >
              {topicOptions.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-secondary-text">Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="mt-2 w-full rounded-xl border border-primary/20 bg-background/60 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/60"
            >
              {difficultyOptions.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-7">
          <button
            onClick={() => startQuiz(false)}
            className="rounded-2xl bg-primary hover:bg-secondary text-white py-3.5 font-black transition-all duration-300 shadow-[0_0_20px_var(--color-primary)]"
          >
            Start Quiz
          </button>
          <button
            onClick={() => startQuiz(true)}
            className="rounded-2xl border border-primary/25 bg-background/60 hover:bg-primary/10 py-3.5 font-black transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Auto-Generate based on Weaknesses
          </button>
        </div>
      </section>
    );
  }

  if (phase === 'summary' && summary) {
    return (
      <section className="max-w-4xl mx-auto rounded-3xl border border-primary/20 bg-card/85 backdrop-blur-xl p-6 md:p-8 shadow-2xl space-y-6">
        <p className="text-xs font-bold uppercase tracking-widest text-secondary-text">Phase 3 • Summary State</p>
        <h2 className="text-3xl font-black">Quiz Complete</h2>

        <div className="rounded-2xl border border-primary/15 bg-background/55 p-4">
          <p className="text-sm text-secondary-text">Final Score</p>
          <p className="text-4xl font-black mt-1">{summary.score}%</p>
          <p className="text-xs text-secondary-text mt-1">
            {summary.correct}/{summary.total} correct answers
          </p>
        </div>

        <div className="rounded-2xl border border-primary/15 bg-background/55 p-4">
          <p className="text-sm font-bold">Identified Weak Topics</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {summary.weakFromQuiz.length ? (
              summary.weakFromQuiz.map((topic) => (
                <span key={topic} className="px-3 py-1 rounded-full bg-red-500/15 text-red-400 text-xs font-bold">
                  {topic}
                </span>
              ))
            ) : (
              <span className="text-sm text-green-400 font-semibold">No weak topics in this run.</span>
            )}
          </div>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="rounded-2xl bg-primary hover:bg-secondary text-white px-6 py-3 font-black transition-all duration-300"
        >
          Back to Dashboard
        </button>
      </section>
    );
  }

  return (
    <section className="max-w-5xl mx-auto rounded-3xl border border-primary/20 bg-card/85 backdrop-blur-xl p-6 md:p-8 shadow-2xl space-y-6">
      <p className="text-xs font-bold uppercase tracking-widest text-secondary-text">
        Phase 3 • {phase === 'question' ? 'Question State' : 'Feedback State'}
      </p>

      <div className="h-2 rounded-full bg-background/70 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-primary to-secondary transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex flex-wrap gap-2 text-xs font-bold">
        <span className="px-2.5 py-1 rounded-full bg-primary/20 text-primary">Topic: {currentQuestion.topic}</span>
        <span className="px-2.5 py-1 rounded-full bg-secondary/20 text-secondary">Difficulty: {currentQuestion.difficulty}</span>
        <span className="px-2.5 py-1 rounded-full bg-accent/20 text-accent">
          Q{currentIndex + 1}/{quizQuestions.length}
        </span>
      </div>

      <div className="rounded-2xl border border-primary/15 bg-background/55 p-5 md:p-6">
        <p className="text-xl md:text-2xl font-black leading-relaxed">{currentQuestion.prompt}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {currentQuestion.options.map((option, index) => {
          const isSelected = selectedOption === index;
          const isCorrectOption = feedback && index === feedback.correctIndex;
          const isIncorrectSelection = feedback && isSelected && !feedback.isCorrect;

          return (
            <button
              key={option}
              onClick={() => phase === 'question' && setSelectedOption(index)}
              disabled={phase === 'feedback'}
              className={`text-left rounded-2xl border px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                phase === 'question'
                  ? isSelected
                    ? 'border-primary bg-primary/15'
                    : 'border-primary/20 bg-background/50 hover:border-primary/45'
                  : isCorrectOption
                    ? 'border-green-500/50 bg-green-500/10'
                    : isIncorrectSelection
                      ? 'border-red-500/50 bg-red-500/10'
                      : 'border-primary/10 bg-background/35 opacity-65'
              }`}
            >
              <span className="text-xs font-black text-secondary-text mr-2">{String.fromCharCode(65 + index)}.</span>
              {option}
            </button>
          );
        })}
      </div>

      {showHint && phase === 'question' ? (
        <div className="rounded-2xl border border-secondary/25 bg-secondary/10 px-4 py-3 text-sm flex items-start gap-2">
          <Lightbulb className="w-4 h-4 text-secondary mt-0.5" />
          {currentQuestion.hint}
        </div>
      ) : null}

      {phase === 'question' ? (
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowHint(true)}
            className="rounded-xl border border-secondary/30 bg-background/60 hover:bg-secondary/10 px-4 py-2.5 text-sm font-bold transition-all"
          >
            Hint
          </button>
          <button
            onClick={submitAnswer}
            disabled={selectedOption === null}
            className="rounded-xl bg-primary hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 text-sm font-bold transition-all"
          >
            Submit
          </button>
        </div>
      ) : (
        <>
          <div className="rounded-2xl border border-primary/15 bg-background/55 p-4">
            <div className="flex items-center gap-2 mb-3">
              {feedback.isCorrect ? (
                <>
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                  <p className="font-black text-green-400">Correct Answer</p>
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 text-red-400" />
                  <p className="font-black text-red-400">Incorrect Answer</p>
                </>
              )}
            </div>

            <div className="rounded-xl border border-primary/15 bg-background/50 p-4 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-secondary-text flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-primary" />
                AI Explanation
              </p>
              <p className="text-sm"><span className="font-bold">Explanation:</span> {feedback.explanation}</p>
              <p className="text-sm"><span className="font-bold">Mistake Type:</span> {feedback.mistakeType}</p>
              <p className="text-sm"><span className="font-bold">Suggestion:</span> {feedback.suggestion}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={nextQuestion}
              className="rounded-xl bg-primary hover:bg-secondary text-white px-5 py-2.5 text-sm font-bold transition-all flex items-center gap-2"
            >
              {currentIndex === quizQuestions.length - 1 ? 'View Summary' : 'Next Question'}
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={askAi}
              className="rounded-xl border border-primary/25 bg-background/60 hover:bg-primary/10 px-5 py-2.5 text-sm font-bold transition-all flex items-center gap-2"
            >
              <MessageSquareText className="w-4 h-4" />
              Ask AI
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default Quiz;

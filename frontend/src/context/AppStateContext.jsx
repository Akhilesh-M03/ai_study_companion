/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useMemo, useState } from 'react';

const AppStateContext = createContext();

const initialTopicPerformance = [
  { subject: 'Math', topic: 'Integration', strength: 38 },
  { subject: 'Math', topic: 'Derivatives', strength: 71 },
  { subject: 'Math', topic: 'Trigonometry', strength: 29 },
  { subject: 'Math', topic: 'Limits', strength: 42 },
  { subject: 'Physics', topic: 'Kinematics', strength: 74 },
  { subject: 'Physics', topic: 'Optics', strength: 33 },
  { subject: 'Physics', topic: 'Waves', strength: 58 },
  { subject: 'Physics', topic: 'Thermodynamics', strength: 61 },
  { subject: 'Chemistry', topic: 'Organic', strength: 47 },
  { subject: 'Chemistry', topic: 'Inorganic', strength: 64 },
  { subject: 'Chemistry', topic: 'Physical', strength: 35 },
  { subject: 'Biology', topic: 'Genetics', strength: 68 },
  { subject: 'CS', topic: 'Algorithms', strength: 72 },
  { subject: 'CS', topic: 'Data Structures', strength: 54 },
  { subject: 'CS', topic: 'Databases', strength: 44 },
];

const initialQuizHistory = [
  {
    id: 'seed-1',
    at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    score: 62,
    correctCount: 3,
    total: 5,
    difficulty: 'Medium',
    source: 'Practice Weak Topics',
    weakTopics: ['Trigonometry', 'Databases'],
  },
  {
    id: 'seed-2',
    at: new Date(Date.now() - 1000 * 60 * 60 * 16).toISOString(),
    score: 74,
    correctCount: 4,
    total: 5,
    difficulty: 'Medium',
    source: 'Manual Quiz',
    weakTopics: ['Optics'],
  },
  {
    id: 'seed-3',
    at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    score: 80,
    correctCount: 4,
    total: 5,
    difficulty: 'Hard',
    source: 'Manual Quiz',
    weakTopics: ['Trigonometry'],
  },
];

const clampStrength = (value) => Math.max(5, Math.min(98, value));

const defaultOnboardingPreferences = {
  avatar: 'robot',
  dailyCommitment: 'focused',
  focusAreas: [],
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
};

export const AppStateProvider = ({ children }) => {
  const [userName, setUserName] = useState('');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [onboardingPreferences, setOnboardingPreferences] = useState(defaultOnboardingPreferences);
  const [topicPerformance, setTopicPerformance] = useState(initialTopicPerformance);
  const [quizHistory, setQuizHistory] = useState(initialQuizHistory);
  const [latestDelta, setLatestDelta] = useState({});
  const [pendingChatPrompt, setPendingChatPrompt] = useState('');

  const weakTopics = useMemo(
    () => [...topicPerformance].filter((topic) => topic.strength < 55).sort((a, b) => a.strength - b.strength),
    [topicPerformance]
  );

  const strongTopics = useMemo(
    () => [...topicPerformance].filter((topic) => topic.strength >= 70).sort((a, b) => b.strength - a.strength),
    [topicPerformance]
  );

  const averageScore = useMemo(() => {
    if (!quizHistory.length) {
      return 0;
    }
    const sum = quizHistory.reduce((acc, attempt) => acc + attempt.score, 0);
    return Math.round(sum / quizHistory.length);
  }, [quizHistory]);

  const insightMessages = useMemo(() => {
    const weakest = weakTopics[0];
    const sortedDelta = Object.entries(latestDelta).sort((a, b) => b[1] - a[1]);
    const improved = sortedDelta.find((entry) => entry[1] > 0);

    return [
      weakest ? `You are weak in ${weakest.topic}` : 'You are stable across topics right now.',
      improved ? `You improved in ${improved[0]}` : 'No fresh improvement yet. Keep the loop running.',
    ];
  }, [latestDelta, weakTopics]);

  const startSession = (name) => {
    const trimmed = name.trim();
    setUserName(trimmed.length ? trimmed : 'Learner');
    setIsOnboardingOpen(true);
  };

  const completeOnboarding = (payload) => {
    setOnboardingPreferences((prev) => ({
      ...prev,
      ...payload,
      focusAreas: payload?.focusAreas ?? prev.focusAreas,
    }));
    setIsOnboardingOpen(false);
  };

  const logout = () => {
    setUserName('');
    setPendingChatPrompt('');
    setIsOnboardingOpen(false);
    setOnboardingPreferences(defaultOnboardingPreferences);
  };

  const recordQuizResult = ({ results, difficulty = 'Medium', source = 'Manual Quiz' }) => {
    const weightMap = { Easy: 4, Medium: 6, Hard: 8 };
    const weight = weightMap[difficulty] ?? 6;

    const deltaByTopic = {};
    results.forEach((item) => {
      const direction = item.isCorrect ? weight : -weight;
      deltaByTopic[item.topic] = (deltaByTopic[item.topic] ?? 0) + direction;
    });

    setLatestDelta(deltaByTopic);

    setTopicPerformance((prev) =>
      prev.map((topic) => {
        const delta = deltaByTopic[topic.topic] ?? 0;
        if (delta === 0) {
          return topic;
        }
        return {
          ...topic,
          strength: clampStrength(topic.strength + delta),
        };
      })
    );

    const correctCount = results.filter((item) => item.isCorrect).length;
    const score = Math.round((correctCount / Math.max(results.length, 1)) * 100);
    const weakTopicsFromAttempt = [...new Set(results.filter((item) => !item.isCorrect).map((item) => item.topic))];

    const newAttempt = {
      id: `${Date.now()}-${Math.round(Math.random() * 10000)}`,
      at: new Date().toISOString(),
      score,
      correctCount,
      total: results.length,
      difficulty,
      source,
      weakTopics: weakTopicsFromAttempt,
    };

    setQuizHistory((prev) => [newAttempt, ...prev].slice(0, 12));
  };

  const queueChatPrompt = (prompt) => {
    setPendingChatPrompt(prompt);
  };

  const consumePendingChatPrompt = () => {
    const prompt = pendingChatPrompt;
    setPendingChatPrompt('');
    return prompt;
  };

  return (
    <AppStateContext.Provider
      value={{
        averageScore,
        completeOnboarding,
        consumePendingChatPrompt,
        insightMessages,
        isOnboardingOpen,
        latestDelta,
        logout,
        onboardingPreferences,
        pendingChatPrompt,
        queueChatPrompt,
        quizHistory,
        recordQuizResult,
        setIsOnboardingOpen,
        startSession,
        strongTopics,
        topicPerformance,
        userName,
        weakTopics,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

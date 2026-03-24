/* eslint-disable react-refresh/only-export-components */
import React, {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  clearStoredAccessToken,
  fetchUserProfile,
  getStoredAccessToken,
  loginUser,
  signupUser,
  storeAccessToken,
} from "../services/authApi";
import {
  fetchInsights,
  fetchMistakes,
  fetchRecommendations,
  fetchWeakTopics,
} from "../services/memoryApi";
import {
  fetchSyllabusTopics,
  uploadSyllabusFile,
} from "../services/syllabusApi";

const AppStateContext = createContext();

const initialTopicPerformance = [
  { subject: "Math", topic: "Integration", strength: 38 },
  { subject: "Math", topic: "Derivatives", strength: 71 },
  { subject: "Math", topic: "Trigonometry", strength: 29 },
  { subject: "Math", topic: "Limits", strength: 42 },
  { subject: "Physics", topic: "Kinematics", strength: 74 },
  { subject: "Physics", topic: "Optics", strength: 33 },
  { subject: "Physics", topic: "Waves", strength: 58 },
  { subject: "Physics", topic: "Thermodynamics", strength: 61 },
  { subject: "Chemistry", topic: "Organic", strength: 47 },
  { subject: "Chemistry", topic: "Inorganic", strength: 64 },
  { subject: "Chemistry", topic: "Physical", strength: 35 },
  { subject: "Biology", topic: "Genetics", strength: 68 },
  { subject: "CS", topic: "Algorithms", strength: 72 },
  { subject: "CS", topic: "Data Structures", strength: 54 },
  { subject: "CS", topic: "Databases", strength: 44 },
];

const initialQuizHistory = [
  {
    id: "seed-1",
    at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    score: 62,
    correctCount: 3,
    total: 5,
    difficulty: "Medium",
    source: "Practice Weak Topics",
    weakTopics: ["Trigonometry", "Databases"],
  },
  {
    id: "seed-2",
    at: new Date(Date.now() - 1000 * 60 * 60 * 16).toISOString(),
    score: 74,
    correctCount: 4,
    total: 5,
    difficulty: "Medium",
    source: "Manual Quiz",
    weakTopics: ["Optics"],
  },
  {
    id: "seed-3",
    at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    score: 80,
    correctCount: 4,
    total: 5,
    difficulty: "Hard",
    source: "Manual Quiz",
    weakTopics: ["Trigonometry"],
  },
];

const clampStrength = (value) => Math.max(5, Math.min(98, value));

const mergeTopicSignals = (currentTopics, weakTopicNames, strongTopicNames) => {
  const weakSet = new Set(weakTopicNames);
  const strongSet = new Set(strongTopicNames);
  const knownTopics = new Set(currentTopics.map((item) => item.topic));

  const adjusted = currentTopics.map((topic) => {
    if (weakSet.has(topic.topic)) {
      return { ...topic, strength: Math.min(topic.strength, 35) };
    }

    if (strongSet.has(topic.topic)) {
      return { ...topic, strength: Math.max(topic.strength, 75) };
    }

    return topic;
  });

  const appended = [];
  weakTopicNames.forEach((topic) => {
    if (!knownTopics.has(topic)) {
      appended.push({ subject: "General", topic, strength: 30 });
      knownTopics.add(topic);
    }
  });

  strongTopicNames.forEach((topic) => {
    if (!knownTopics.has(topic)) {
      appended.push({ subject: "General", topic, strength: 80 });
      knownTopics.add(topic);
    }
  });

  return [...adjusted, ...appended];
};

const defaultOnboardingPreferences = {
  avatar: "robot",
  dailyCommitment: "focused",
  focusAreas: [],
};

const ONBOARDED_USERS_STORAGE_KEY = "ai-tutor-onboarded-users";

const getUserStorageKey = (name) => name.trim().toLowerCase();

const getOnboardedUsers = () => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(ONBOARDED_USERS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const hasCompletedOnboarding = (name) => {
  const key = getUserStorageKey(name);
  if (!key) {
    return false;
  }
  return getOnboardedUsers().includes(key);
};

const markOnboardingComplete = (name) => {
  if (typeof window === "undefined") {
    return;
  }

  const key = getUserStorageKey(name);
  if (!key) {
    return;
  }

  const users = getOnboardedUsers();
  if (users.includes(key)) {
    return;
  }

  window.localStorage.setItem(
    ONBOARDED_USERS_STORAGE_KEY,
    JSON.stringify([...users, key]),
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within AppStateProvider");
  }
  return context;
};

export const AppStateProvider = ({ children }) => {
  const [userName, setUserName] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [authToken, setAuthToken] = useState(getStoredAccessToken);
  const [authReady, setAuthReady] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [authError, setAuthError] = useState("");
  const [onboardingPreferences, setOnboardingPreferences] = useState(
    defaultOnboardingPreferences,
  );
  const [topicPerformance, setTopicPerformance] = useState(
    initialTopicPerformance,
  );
  const [serverWeakTopicNames, setServerWeakTopicNames] = useState([]);
  const [serverStrongTopicNames, setServerStrongTopicNames] = useState([]);
  const [serverMostCommonMistakeType, setServerMostCommonMistakeType] =
    useState(null);
  const [serverRecommendations, setServerRecommendations] = useState([]);
  const [serverMistakes, setServerMistakes] = useState([]);
  const [serverTotalRecords, setServerTotalRecords] = useState(0);
  const [serverSyllabusTopics, setServerSyllabusTopics] = useState([]);
  const [serverSyllabusSubjects, setServerSyllabusSubjects] = useState([]);
  const [hasUploadedSyllabus, setHasUploadedSyllabus] = useState(false);
  const [quizHistory, setQuizHistory] = useState(initialQuizHistory);
  const [latestDelta, setLatestDelta] = useState({});
  const [pendingChatPrompt, setPendingChatPrompt] = useState("");

  const weakTopics = useMemo(
    () =>
      [...topicPerformance]
        .filter((topic) => topic.strength < 55)
        .sort((a, b) => a.strength - b.strength),
    [topicPerformance],
  );

  const strongTopics = useMemo(
    () =>
      [...topicPerformance]
        .filter((topic) => topic.strength >= 70)
        .sort((a, b) => b.strength - a.strength),
    [topicPerformance],
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
      weakest
        ? `You are weak in ${weakest.topic}`
        : "You are stable across topics right now.",
      improved
        ? `You improved in ${improved[0]}`
        : "No fresh improvement yet. Keep the loop running.",
    ];
  }, [latestDelta, weakTopics]);

  const refreshLearningInsights = useCallback(
    async (userId = userName, token = authToken) => {
      const resolvedUserId = (userId || "").trim();
      if (!resolvedUserId || !token) {
        return;
      }

      try {
        const [weakTopicData, insightsData, mistakesData, recommendationsData] =
          await Promise.all([
            fetchWeakTopics(resolvedUserId, token),
            fetchInsights(resolvedUserId, token),
            fetchMistakes(resolvedUserId, token),
            fetchRecommendations(resolvedUserId, token),
          ]);

        const weakNames = Array.isArray(weakTopicData?.weak_topics)
          ? weakTopicData.weak_topics
          : [];
        const strongNames = Array.isArray(insightsData?.insights?.strong_topics)
          ? insightsData.insights.strong_topics
          : [];
        const mostCommonMistakeType =
          insightsData?.insights?.most_common_mistake_type || null;
        const recommendations = Array.isArray(
          recommendationsData?.recommendations,
        )
          ? recommendationsData.recommendations
          : [];
        const mistakes = Array.isArray(mistakesData?.mistakes)
          ? mistakesData.mistakes
          : [];
        const totalRecords = Number.isFinite(insightsData?.total_records)
          ? insightsData.total_records
          : mistakes.length;

        setServerWeakTopicNames(weakNames);
        setServerStrongTopicNames(strongNames);
        setServerMostCommonMistakeType(mostCommonMistakeType);
        setServerRecommendations(recommendations);
        setServerMistakes(mistakes);
        setServerTotalRecords(totalRecords);
        setTopicPerformance((prev) =>
          mergeTopicSignals(prev, weakNames, strongNames),
        );
      } catch {
        // Keep local fallback state when memory API is unavailable.
      }
    },
    [authToken, userName],
  );

  const refreshSyllabusTopics = useCallback(
    async (userId = userName, token = authToken) => {
      const resolvedUserId = (userId || "").trim();
      if (!resolvedUserId || !token) {
        return;
      }

      try {
        const response = await fetchSyllabusTopics(resolvedUserId, token);
        setHasUploadedSyllabus(Boolean(response?.has_syllabus));
        setServerSyllabusTopics(
          Array.isArray(response?.topics) ? response.topics : [],
        );
        setServerSyllabusSubjects(
          Array.isArray(response?.subjects) ? response.subjects : [],
        );
      } catch {
        // Keep existing topics if syllabus service is unavailable.
      }
    },
    [authToken, userName],
  );

  const refreshUserProfile = useCallback(
    async (token = authToken) => {
      if (!token) {
        return null;
      }

      const profile = await fetchUserProfile(token);
      setUserName(profile?.username || "Learner");
      setUserProfile(profile || null);
      return profile;
    },
    [authToken],
  );

  const uploadAndRefreshSyllabus = useCallback(
    async (file) => {
      if (!authToken || !userName) {
        throw new Error("Sign in before uploading a syllabus.");
      }

      await uploadSyllabusFile({ userId: userName, token: authToken, file });
      await refreshSyllabusTopics(userName, authToken);
    },
    [authToken, refreshSyllabusTopics, userName],
  );

  useEffect(() => {
    let isActive = true;

    const bootstrapSession = async () => {
      if (!authToken) {
        if (isActive) {
          setAuthReady(true);
        }
        return;
      }

      try {
        const profile = await refreshUserProfile(authToken);
        if (isActive) {
          setAuthError("");
          await refreshLearningInsights(profile?.username || "", authToken);
          await refreshSyllabusTopics(profile?.username || "", authToken);
        }
      } catch {
        clearStoredAccessToken();
        if (isActive) {
          setAuthToken("");
          setUserName("");
        }
      } finally {
        if (isActive) {
          setAuthReady(true);
        }
      }
    };

    bootstrapSession();

    return () => {
      isActive = false;
    };
  }, [
    authToken,
    refreshLearningInsights,
    refreshSyllabusTopics,
    refreshUserProfile,
  ]);

  useEffect(() => {
    if (!userName || !authToken) {
      setServerWeakTopicNames([]);
      setServerStrongTopicNames([]);
      setServerMostCommonMistakeType(null);
      setServerRecommendations([]);
      setServerMistakes([]);
      setServerTotalRecords(0);
      setServerSyllabusTopics([]);
      setServerSyllabusSubjects([]);
      setHasUploadedSyllabus(false);
      return;
    }

    refreshLearningInsights(userName, authToken);
    refreshSyllabusTopics(userName, authToken);
  }, [authToken, refreshLearningInsights, refreshSyllabusTopics, userName]);

  const loginWithCredentials = async ({ username, password }) => {
    const normalizedUsername = username.trim();
    const response = await loginUser({
      username: normalizedUsername,
      password,
    });
    storeAccessToken(response.access_token);
    setAuthToken(response.access_token);

    const profile = await refreshUserProfile(response.access_token);
    const resolvedUserName =
      profile?.username || normalizedUsername || "Learner";
    setUserName(resolvedUserName);
    setAuthError("");
    setIsOnboardingOpen(!hasCompletedOnboarding(resolvedUserName));
    return profile;
  };

  const registerAndLogin = async ({ username, email, password }) => {
    await signupUser({ username: username.trim(), email, password });
    await loginWithCredentials({ username, password });
    setIsOnboardingOpen(true);
  };

  const startSession = (name, options = {}) => {
    const trimmed = name.trim();
    const showOnboarding =
      options.showOnboarding ?? !hasCompletedOnboarding(trimmed);
    setUserName(trimmed.length ? trimmed : "Learner");
    setIsOnboardingOpen(showOnboarding);
  };

  const completeOnboarding = (payload) => {
    setOnboardingPreferences((prev) => ({
      ...prev,
      ...payload,
      focusAreas: payload?.focusAreas ?? prev.focusAreas,
    }));
    markOnboardingComplete(userName);
    setIsOnboardingOpen(false);
  };

  const logout = () => {
    clearStoredAccessToken();
    setAuthToken("");
    setUserName("");
    setUserProfile(null);
    setPendingChatPrompt("");
    setIsOnboardingOpen(false);
    setOnboardingPreferences(defaultOnboardingPreferences);
    setAuthError("");
  };

  const recordQuizResult = ({
    results,
    difficulty = "Medium",
    source = "Manual Quiz",
  }) => {
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
      }),
    );

    const correctCount = results.filter((item) => item.isCorrect).length;
    const score = Math.round(
      (correctCount / Math.max(results.length, 1)) * 100,
    );
    const weakTopicsFromAttempt = [
      ...new Set(
        results.filter((item) => !item.isCorrect).map((item) => item.topic),
      ),
    ];

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
    setPendingChatPrompt("");
    return prompt;
  };

  return (
    <AppStateContext.Provider
      value={{
        averageScore,
        authError,
        authReady,
        authToken,
        completeOnboarding,
        consumePendingChatPrompt,
        hasUploadedSyllabus,
        insightMessages,
        isOnboardingOpen,
        latestDelta,
        loginWithCredentials,
        logout,
        onboardingPreferences,
        pendingChatPrompt,
        queueChatPrompt,
        quizHistory,
        recordQuizResult,
        refreshLearningInsights,
        refreshUserProfile,
        refreshSyllabusTopics,
        registerAndLogin,
        serverMistakes,
        serverMostCommonMistakeType,
        serverRecommendations,
        serverStrongTopicNames,
        serverSyllabusSubjects,
        serverSyllabusTopics,
        serverTotalRecords,
        serverWeakTopicNames,
        setIsOnboardingOpen,
        startSession,
        strongTopics,
        topicPerformance,
        uploadAndRefreshSyllabus,
        userProfile,
        userName,
        weakTopics,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

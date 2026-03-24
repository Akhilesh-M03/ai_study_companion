import { apiRequest } from "./apiClient";

export const storeMemoryBatch = async ({ userId, attempts, token }) => {
  return apiRequest("/store-memory-batch", {
    method: "POST",
    token,
    body: {
      user_id: userId,
      attempts,
    },
  });
};

export const fetchWeakTopics = async (userId, token) => {
  return apiRequest(`/weak-topics/${encodeURIComponent(userId)}`, {
    token,
  });
};

export const fetchInsights = async (userId, token) => {
  return apiRequest(`/insights/${encodeURIComponent(userId)}`, {
    token,
  });
};

export const fetchMistakes = async (userId, token) => {
  return apiRequest(`/mistakes/${encodeURIComponent(userId)}`, {
    token,
  });
};

export const fetchRecommendations = async (userId, token) => {
  return apiRequest(`/recommendations/${encodeURIComponent(userId)}`, {
    token,
  });
};

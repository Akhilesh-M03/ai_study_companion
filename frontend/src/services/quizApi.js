import { apiRequest } from "./apiClient";

export const generateQuizQuestions = async ({
  topic,
  difficulty = "medium",
  userId,
  useRecommendations = true,
}) => {
  return apiRequest("/generate-question", {
    method: "POST",
    body: {
      topic,
      difficulty,
      question_count: 2,
      user_id: userId,
      use_recommendations: useRecommendations,
    },
  });
};

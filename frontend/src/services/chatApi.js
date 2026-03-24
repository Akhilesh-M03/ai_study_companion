import { apiRequest } from "./apiClient";

export const sendChatMessage = async (message, history = []) => {
  return apiRequest("/chat", {
    method: "POST",
    body: { message, history },
  });
};

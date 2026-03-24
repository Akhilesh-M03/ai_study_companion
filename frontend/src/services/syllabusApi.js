import { API_BASE_URL, ApiError, apiRequest } from "./apiClient";

const parseResponse = async (response) => {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return { detail: text };
  }
};

export const fetchSyllabusTopics = async (userId, token) => {
  return apiRequest(`/syllabus/${encodeURIComponent(userId)}/topics`, {
    token,
  });
};

export const uploadSyllabusFile = async ({ userId, token, file }) => {
  const formData = new FormData();
  formData.append("user_id", userId);
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/syllabus/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    body: formData,
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    const detail =
      (data && typeof data === "object" && data.detail) ||
      "Failed to upload syllabus";
    throw new ApiError(String(detail), response.status, data);
  }

  return data;
};

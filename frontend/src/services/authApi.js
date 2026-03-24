import { apiRequest } from "./apiClient";

const ACCESS_TOKEN_STORAGE_KEY = "ai-tutor-access-token";

export const loginUser = async ({ username, password }) => {
  return apiRequest("/login", {
    method: "POST",
    body: { username, password },
  });
};

export const signupUser = async ({ username, email, password }) => {
  return apiRequest("/signup", {
    method: "POST",
    body: { username, email, password },
  });
};

export const fetchUserProfile = async (accessToken) => {
  return apiRequest("/user/profile", {
    token: accessToken,
  });
};

export const updateUserProfile = async (accessToken, profileData) => {
  return apiRequest("/user/profile", {
    method: "PUT",
    token: accessToken,
    body: profileData,
  });
};

export const getStoredAccessToken = () => {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) || "";
};

export const storeAccessToken = (accessToken) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
};

export const clearStoredAccessToken = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
};

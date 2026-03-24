// Chat context tuning:
// - Keep windows between 4 and 10 turns for free-tier-friendly usage.
// - Start with [8, 6, 4] to preserve recent context while shrinking for long prompts.
// - Keep TARGET_INPUT_TOKENS around 1200-2200 based on your rate-limit headroom.
// - If you see frequent 429 responses, lower windows and/or token target.
export const CHAT_HISTORY_WINDOWS = [8, 6, 4];
export const TARGET_INPUT_TOKENS = 1800;

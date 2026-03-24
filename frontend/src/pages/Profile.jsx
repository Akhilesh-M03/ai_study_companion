import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookOpenCheck,
  BrainCircuit,
  FileUp,
  GraduationCap,
  IdCard,
  Save,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { useAppState } from "../context/AppStateContext";
import { updateUserProfile } from "../services/authApi";

const calculateStreakDays = (quizHistory) => {
  const days = [
    ...new Set(
      quizHistory
        .map((item) => {
          if (!item?.at) {
            return null;
          }
          const date = new Date(item.at);
          if (Number.isNaN(date.getTime())) {
            return null;
          }
          return date.toISOString().slice(0, 10);
        })
        .filter(Boolean),
    ),
  ].sort((a, b) => (a > b ? -1 : 1));

  if (!days.length) {
    return 0;
  }

  let streak = 1;
  for (let i = 1; i < days.length; i += 1) {
    const current = new Date(days[i - 1]);
    const previous = new Date(days[i]);
    const diffDays = Math.round(
      (current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diffDays === 1) {
      streak += 1;
    } else {
      break;
    }
  }

  return streak;
};

const Profile = () => {
  const MotionSection = motion.section;
  const {
    averageScore,
    authToken,
    hasUploadedSyllabus,
    quizHistory,
    serverRecommendations,
    serverTotalRecords,
    serverSyllabusSubjects,
    serverSyllabusTopics,
    strongTopics,
    refreshUserProfile,
    userName,
    userProfile,
    uploadAndRefreshSyllabus,
    weakTopics,
  } = useAppState();

  const [goals, setGoals] = useState({
    dailyHours: "",
    dsaProblems: "",
    revisionMinutes: "",
  });

  const [uploadMessage, setUploadMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // Initialize goals from userProfile when it loads
  useEffect(() => {
    if (userProfile) {
      setGoals({
        dailyHours: String(userProfile.daily_study_hours || 1),
        dsaProblems: String(userProfile.dsa_problems_per_day || 5),
        revisionMinutes: String(userProfile.revision_minutes_per_day || 30),
      });
    }
  }, [userProfile]);

  useEffect(() => {
    if (!authToken) {
      return;
    }

    refreshUserProfile(authToken).catch(() => {
      // Keep existing profile state if refresh fails.
    });
  }, [authToken, refreshUserProfile]);

  const displayName =
    userProfile?.full_name || userProfile?.username || userName || "Learner";
  const displaySubheading = userProfile?.email || "AI Study Companion learner";
  const quizzesCompleted =
    userProfile?.quizzes_completed !== undefined
      ? userProfile.quizzes_completed
      : serverTotalRecords || quizHistory.length;
  const weeklyStreak =
    userProfile?.weekly_streak !== undefined
      ? userProfile.weekly_streak
      : calculateStreakDays(quizHistory);
  const syllabusCoverage = hasUploadedSyllabus
    ? Math.min(95, 40 + serverSyllabusTopics.length * 4)
    : 0;
  const dsaGoalPace = Math.min(
    100,
    Math.max(
      20,
      Math.round(
        (strongTopics.length /
          Math.max(weakTopics.length + strongTopics.length, 1)) *
          100,
      ),
    ),
  );
  const topRecommendation = serverRecommendations[0];

  const handleSave = async (event) => {
    event.preventDefault();
    setSaveMessage("");
    setIsSaving(true);

    try {
      await updateUserProfile(authToken, {
        daily_study_hours: parseInt(goals.dailyHours, 10) || 1,
        dsa_problems_per_day: parseInt(goals.dsaProblems, 10) || 5,
        revision_minutes_per_day: parseInt(goals.revisionMinutes, 10) || 30,
      });
      setSaveMessage("Changes saved successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      const message =
        typeof error?.message === "string"
          ? error.message
          : "Unable to save changes right now.";
      setSaveMessage(`Error: ${message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSyllabusUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setIsUploading(true);
    setUploadMessage("");

    try {
      await uploadAndRefreshSyllabus(file);
      setUploadMessage("Syllabus uploaded and topics synced.");
    } catch (error) {
      const message =
        typeof error?.message === "string"
          ? error.message
          : "Unable to upload syllabus right now.";
      setUploadMessage(message);
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="bg-slate-50 min-h-full space-y-6">
      <section className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
              <BrainCircuit className="w-8 h-8" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Profile Overview
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mt-1">
                {displayName}
              </h1>
              <p className="text-slate-500 text-sm mt-1">{displaySubheading}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">Weekly Streak</p>
              <p className="text-lg font-semibold text-slate-800">
                {weeklyStreak} day{weeklyStreak === 1 ? "" : "s"}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">Quizzes Completed</p>
              <p className="text-lg font-semibold text-slate-800">
                {quizzesCompleted}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <section className="xl:col-span-2 bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Learning Path
              </p>
              <h2 className="text-xl font-bold text-slate-800 mt-1">
                Java Full-Stack Mastery & LeetCode Prep
              </h2>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700">
              <Sparkles className="w-3.5 h-3.5" />
              Active Track
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
            <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-slate-700">
                <BookOpenCheck className="w-4 h-4 text-emerald-600" />
                <p className="text-sm font-semibold">Syllabus Coverage</p>
              </div>
              <p className="text-2xl font-bold text-slate-800 mt-2">
                {syllabusCoverage}%
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {hasUploadedSyllabus
                  ? `${serverSyllabusTopics.length} topics synced from your syllabus`
                  : "Upload your syllabus to unlock topic-personalized planning"}
              </p>
            </article>

            <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-slate-700">
                <Target className="w-4 h-4 text-emerald-600" />
                <p className="text-sm font-semibold">DSA Goal Pace</p>
              </div>
              <p className="text-2xl font-bold text-slate-800 mt-2">
                {dsaGoalPace}%
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Based on strong-topic ratio in your current performance map
              </p>
            </article>

            <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-slate-700">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <p className="text-sm font-semibold">Accuracy Trend</p>
              </div>
              <p className="text-2xl font-bold text-slate-800 mt-2">
                {averageScore}%
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Average score across your recent attempts
              </p>
            </article>

            <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-slate-700">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                <p className="text-sm font-semibold">Interview Readiness</p>
              </div>
              <p className="text-2xl font-bold text-slate-800 mt-2">
                {topRecommendation?.recommended_difficulty || "Medium"}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {topRecommendation?.topic
                  ? `Focus next: ${topRecommendation.topic}`
                  : "Complete a few more quizzes to unlock focused recommendations"}
              </p>
            </article>
          </div>
        </section>

        <section className="xl:col-span-2 bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Syllabus Sync
              </p>
              <h2 className="text-xl font-bold text-slate-800 mt-1">
                Upload PDF or DOCX to Personalize Topics
              </h2>
            </div>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 text-slate-700">
              {hasUploadedSyllabus ? "Synced" : "Not synced"}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <label className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 text-sm font-semibold cursor-pointer transition-colors shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              <FileUp className="w-4 h-4" />
              {isUploading ? "Uploading..." : "Upload Syllabus"}
              <input
                type="file"
                accept=".pdf,.docx"
                className="hidden"
                disabled={isUploading}
                onChange={handleSyllabusUpload}
              />
            </label>
            <p className="text-xs text-slate-500">
              Supported formats: .pdf, .docx
            </p>
          </div>

          {uploadMessage ? (
            <p className="text-sm font-semibold text-slate-700 mt-3">
              {uploadMessage}
            </p>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
            <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Subjects
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {serverSyllabusSubjects.length ? (
                  serverSyllabusSubjects.slice(0, 8).map((subject) => (
                    <span
                      key={subject}
                      className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700"
                    >
                      {subject}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">
                    No syllabus subjects available yet.
                  </p>
                )}
              </div>
            </article>

            <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Topics
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {serverSyllabusTopics.length ? (
                  serverSyllabusTopics.slice(0, 12).map((topic) => (
                    <span
                      key={topic}
                      className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-xs font-semibold text-emerald-700"
                    >
                      {topic}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">
                    Upload a syllabus to auto-fill quiz topics.
                  </p>
                )}
              </div>
            </article>
          </div>
        </section>

        <MotionSection
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Settings
          </p>
          <h2 className="text-xl font-bold text-slate-800 mt-1">
            Daily Study Goals
          </h2>

          <form className="mt-5 space-y-4" onSubmit={handleSave}>
            <label className="block">
              <span className="text-sm text-slate-500">Daily Study Hours</span>
              <input
                type="number"
                min="1"
                step="1"
                value={goals.dailyHours}
                onChange={(event) =>
                  setGoals((prev) => ({
                    ...prev,
                    dailyHours: event.target.value,
                  }))
                }
                className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500/35 focus:border-emerald-500"
              />
            </label>

            <label className="block">
              <span className="text-sm text-slate-500">DSA Problems / Day</span>
              <input
                type="number"
                min="1"
                value={goals.dsaProblems}
                onChange={(event) =>
                  setGoals((prev) => ({
                    ...prev,
                    dsaProblems: event.target.value,
                  }))
                }
                className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500/35 focus:border-emerald-500"
              />
            </label>

            <label className="block">
              <span className="text-sm text-slate-500">
                Revision Minutes / Day
              </span>
              <input
                type="number"
                min="10"
                step="5"
                value={goals.revisionMinutes}
                onChange={(event) =>
                  setGoals((prev) => ({
                    ...prev,
                    revisionMinutes: event.target.value,
                  }))
                }
                className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500/35 focus:border-emerald-500"
              />
            </label>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-400 text-white py-2.5 font-semibold inline-flex items-center justify-center gap-2 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.4)]"
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Saving..." : "Save Changes"}
            </button>

            {saveMessage && (
              <div
                className={`text-sm rounded-lg p-3 text-center font-medium ${
                  saveMessage.includes("Error")
                    ? "bg-red-50 text-red-700"
                    : "bg-emerald-50 text-emerald-700"
                }`}
              >
                {saveMessage}
              </div>
            )}
          </form>

          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3">
            <p className="text-xs text-slate-500">Student ID Display</p>
            <p className="text-sm font-semibold text-slate-800 mt-1 inline-flex items-center gap-1.5">
              <IdCard className="w-3.5 h-3.5 text-emerald-600" />
              {userProfile?.student_id || "Not assigned"}
            </p>
          </div>
        </MotionSection>
      </div>
    </div>
  );
};

export default Profile;

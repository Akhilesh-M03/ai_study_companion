import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  MessageSquareText,
  Rocket,
  FileBarChart2,
  Target,
  TrendingUp,
  Sparkles,
  Gauge,
  Activity,
} from "lucide-react";
import WeaknessHeatmap from "../components/WeaknessHeatmap";
import ProgressGraph from "../components/ProgressGraph";
import { useAppState } from "../context/AppStateContext";

const buildProgressData = (quizHistory) => {
  const recent = [...quizHistory].slice(-8).map((attempt) => {
    const date = attempt?.at ? new Date(attempt.at) : null;
    const label = date
      ? date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      : "Recent";
    return {
      label,
      score: attempt?.score ?? 60,
    };
  });

  if (recent.length) return recent;

  return [
    { label: "Mon", score: 62 },
    { label: "Tue", score: 68 },
    { label: "Wed", score: 71 },
    { label: "Thu", score: 74 },
    { label: "Fri", score: 76 },
    { label: "Sat", score: 80 },
    { label: "Sun", score: 82 },
  ];
};

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    averageScore,
    latestDelta,
    quizHistory,
    serverRecommendations,
    serverTotalRecords,
    topicPerformance,
    weakTopics,
    userName,
  } = useAppState();

  const sortedImprovements = Object.entries(latestDelta).sort(
    (a, b) => b[1] - a[1],
  );
  const strongestImprovement = sortedImprovements.find((item) => item[1] > 0);
  const weakTopic = weakTopics[0]?.topic || "Trigonometry";
  const topRecommendation = serverRecommendations[0];
  const improvementMessage = strongestImprovement
    ? `You improved in ${strongestImprovement[0]} (+${strongestImprovement[1]}%)`
    : topRecommendation
      ? `Recommended next: ${topRecommendation.topic} (${topRecommendation.recommended_difficulty})`
      : "Keep practicing to unlock stronger recommendations.";

  const progressData = buildProgressData(quizHistory);

  const weakCount = topicPerformance.filter(
    (topic) => topic.strength < 40,
  ).length;
  const averageCount = topicPerformance.filter(
    (topic) => topic.strength >= 40 && topic.strength <= 69,
  ).length;
  const strongCount = topicPerformance.filter(
    (topic) => topic.strength >= 70,
  ).length;
  const totalTopics = Math.max(topicPerformance.length, 1);

  const statCards = [
    {
      id: "avg-score",
      label: "Avg Score",
      value: `${averageScore}%`,
      hint: "Across recent quizzes",
      icon: <Gauge className="w-4 h-4" />,
    },
    {
      id: "weak-topics",
      label: "Weak Topics",
      value: weakCount,
      hint: "Need focused drills",
      icon: <Target className="w-4 h-4" />,
    },
    {
      id: "quizzes",
      label: "Quizzes Logged",
      value: serverTotalRecords || quizHistory.length || 12,
      hint: serverTotalRecords ? "Synced from memory" : "Last 30 days",
      icon: <Activity className="w-4 h-4" />,
    },
    {
      id: "next-focus",
      label: "Next Focus",
      value: topRecommendation?.topic || "In progress",
      hint: topRecommendation
        ? topRecommendation.reason
        : strongestImprovement
          ? `Improvement in ${strongestImprovement[0]}`
          : "Recommendations appear after more attempts",
      icon: <TrendingUp className="w-4 h-4" />,
    },
  ];

  const quickActions = [
    {
      id: "start-quiz",
      label: "Start Quiz",
      icon: <Rocket className="w-4 h-4" />,
      onClick: () => navigate("/quiz"),
    },
    {
      id: "chat-ai",
      label: "Chat with AI",
      icon: <MessageSquareText className="w-4 h-4" />,
      onClick: () => navigate("/chat"),
    },
    {
      id: "weak-topics",
      label: "Practice Weak Topics",
      icon: <Target className="w-4 h-4" />,
      onClick: () => navigate("/quiz", { state: { autoWeak: true } }),
    },
    {
      id: "report",
      label: "Generate Report",
      icon: <FileBarChart2 className="w-4 h-4" />,
      onClick: () => navigate("/report"),
    },
  ];

  const cardClass =
    "bg-white border border-slate-200 shadow-sm rounded-2xl p-6";
  const ctaClass =
    "rounded-xl px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all duration-200";

  return (
    <div className="space-y-6">
      <section className={cardClass}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Dashboard
                </p>
                <h1 className="text-2xl font-bold text-slate-900">
                  Welcome back, {userName || "Learner"}
                </h1>
                <p className="text-sm text-slate-500">
                  Quick view of your learning momentum today.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
                <p className="text-sm font-medium text-slate-800">
                  Weakest area: {weakTopic}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
                <p className="text-sm font-medium text-slate-800">
                  {improvementMessage}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/quiz", { state: { autoWeak: true } })}
            className={ctaClass}
          >
            Practice Weak Topics
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.id}
            className={`${cardClass} flex items-start justify-between`}
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                {card.label}
              </p>
              <p className="text-2xl font-bold mt-1 text-slate-900">
                {card.value}
              </p>
              <p className="text-xs text-slate-500 mt-1">{card.hint}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              {card.icon}
            </div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <article className={`${cardClass} xl:col-span-2`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Accuracy Trend
              </p>
              <h3 className="text-xl font-bold text-slate-900">
                Progress Graph
              </h3>
            </div>
            <Sparkles className="w-5 h-5 text-amber-500" />
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <ProgressGraph data={progressData} />
          </div>
        </article>

        <article className={`${cardClass} space-y-5`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Performance Breakdown
              </p>
              <h3 className="text-3xl font-bold mt-1 text-slate-900">
                {averageScore}%
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Average score across recent quiz attempts
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1 text-slate-700">
                <span>Weak Topics</span>
                <span>{weakCount}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-red-500"
                  style={{ width: `${(weakCount / totalTopics) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1 text-slate-700">
                <span>Average Topics</span>
                <span>{averageCount}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-yellow-400"
                  style={{ width: `${(averageCount / totalTopics) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1 text-slate-700">
                <span>Strong Topics</span>
                <span>{strongCount}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-emerald-500"
                  style={{ width: `${(strongCount / totalTopics) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
            <p className="text-xs text-slate-500">Current weakest topic</p>
            <p className="text-sm font-semibold mt-1 text-slate-800">
              {weakTopics[0] ? weakTopics[0].topic : "No weak topic detected"}
            </p>
          </div>
        </article>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <article className={`${cardClass} xl:col-span-2`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Weakness Heatmap
              </p>
              <h3 className="text-xl font-bold text-slate-900">Skill Zones</h3>
            </div>
            <button
              onClick={() => navigate("/quiz", { state: { autoWeak: true } })}
              className={`${ctaClass} px-4 py-2 text-sm`}
            >
              Practice Weakest
            </button>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <WeaknessHeatmap items={topicPerformance} />
          </div>
        </article>

        <article className={cardClass}>
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={action.onClick}
                className="rounded-xl border border-slate-200 bg-slate-50 hover:bg-white transition-all duration-200 px-4 py-4 text-left flex items-center gap-3"
              >
                <span className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  {action.icon}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {action.label}
                  </p>
                  <p className="text-xs text-slate-500">Jump into this flow</p>
                </div>
              </button>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
};

export default Dashboard;

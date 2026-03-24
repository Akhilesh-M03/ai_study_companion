import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, TrendingDown, FileBarChart2 } from "lucide-react";
import { useAppState } from "../context/AppStateContext";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const ReportPage = () => {
  const navigate = useNavigate();
  const {
    quizHistory,
    serverMistakes,
    serverMostCommonMistakeType,
    serverRecommendations,
    strongTopics,
    weakTopics,
  } = useAppState();

  const trend = useMemo(() => {
    const recent = quizHistory.slice(0, 3);
    const previous = quizHistory.slice(3, 6);

    const recentAvg = recent.length
      ? recent.reduce((acc, item) => acc + item.score, 0) / recent.length
      : 0;
    const previousAvg = previous.length
      ? previous.reduce((acc, item) => acc + item.score, 0) / previous.length
      : recentAvg;

    return Math.round(recentAvg - previousAvg);
  }, [quizHistory]);

  const scoreSeries =
    serverMistakes.length > 0
      ? [...serverMistakes]
          .slice(0, 10)
          .map((item, index) => ({
            label: item.topic || `Mistake ${index + 1}`,
            score: item.score ?? 0,
          }))
          .reverse()
      : quizHistory
          .slice(0, 10)
          .map((item, index) => ({
            label: item.source || `Attempt ${index + 1}`,
            score: item.score,
          }))
          .reverse();

  const cardClass =
    "bg-white border border-slate-200 shadow-sm rounded-2xl p-6";
  const ctaClass =
    "rounded-xl px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all duration-200";

  return (
    <section className="space-y-6 text-slate-800">
      <header className={cardClass}>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Learning Report
        </p>
        <h2 className="text-3xl font-bold mt-2 flex items-center gap-2 text-slate-900">
          <FileBarChart2 className="w-7 h-7 text-emerald-500" />
          Performance Overview
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          Strengths, weaknesses, and trend signals generated from your latest
          attempts.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <article className={cardClass}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Trend
          </p>
          <div className="mt-3 flex items-center gap-2">
            {trend >= 0 ? (
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-500" />
            )}
            <p
              className={`text-2xl font-bold ${trend >= 0 ? "text-emerald-600" : "text-red-600"}`}
            >
              {trend}%
            </p>
          </div>
          <p className="text-sm text-slate-500 mt-2">
            Change in average score across recent attempts.
          </p>
        </article>

        <article className={cardClass}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Strongest Topics
          </p>
          <div className="mt-3 space-y-2 text-slate-800">
            {strongTopics.slice(0, 4).map((item) => (
              <div
                key={item.topic}
                className="flex items-center justify-between text-sm"
              >
                <span>{item.topic}</span>
                <span className="font-semibold text-emerald-600">
                  {item.strength}%
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className={cardClass}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Weakest Topics
          </p>
          <div className="mt-3 space-y-2 text-slate-800">
            {weakTopics.slice(0, 4).map((item) => (
              <div
                key={item.topic}
                className="flex items-center justify-between text-sm"
              >
                <span>{item.topic}</span>
                <span className="font-semibold text-red-500">
                  {item.strength}%
                </span>
              </div>
            ))}
            {!weakTopics.length ? (
              <p className="text-sm text-slate-500">
                No weak topics right now.
              </p>
            ) : null}
          </div>
        </article>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <article className={cardClass}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Most Common Mistake Type
          </p>
          <p className="text-2xl font-bold mt-2 text-slate-900">
            {serverMostCommonMistakeType || "No pattern yet"}
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Derived from synced memory records.
          </p>
        </article>

        <article className={cardClass}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Recommended Next Topics
          </p>
          <div className="mt-3 space-y-2 text-slate-800">
            {serverRecommendations.slice(0, 3).map((item, index) => (
              <div
                key={`${item.topic}-${index}`}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
              >
                <p className="text-sm font-semibold text-slate-900">
                  {item.topic} ({item.recommended_difficulty})
                </p>
                <p className="text-xs text-slate-500 mt-1">{item.reason}</p>
              </div>
            ))}
            {!serverRecommendations.length ? (
              <p className="text-sm text-slate-500">
                No recommendations yet. Complete a few more quizzes.
              </p>
            ) : null}
          </div>
        </article>
      </div>

      <article className={cardClass}>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Topic Trends
        </p>
        <p className="text-xs text-slate-500 mt-2">
          {serverMistakes.length
            ? "Showing backend memory mistakes trend"
            : "Showing local recent attempt trend"}
        </p>
        <div className="mt-4 h-72 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={scoreSeries}
              margin={{ top: 8, right: 12, left: -8, bottom: 0 }}
            >
              <defs>
                <linearGradient id="reportGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="rgba(16,185,129,0.7)"
                    stopOpacity={1}
                  />
                  <stop
                    offset="100%"
                    stopColor="rgba(16,185,129,0)"
                    stopOpacity={0.08}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="label"
                tick={{ fill: "#64748b", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                interval={0}
                angle={-25}
                textAnchor="end"
                height={50}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: "#64748b", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#0b1726",
                  border: "1px solid rgba(226,232,240,0.3)",
                  borderRadius: 12,
                  color: "#e2e8f0",
                }}
                labelStyle={{ color: "#e2e8f0" }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="rgba(16,185,129,0.9)"
                strokeWidth={3}
                fill="url(#reportGradient)"
                isAnimationActive
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </article>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => navigate("/quiz", { state: { autoWeak: true } })}
          className={ctaClass}
        >
          Practice Weak Topics
        </button>
        <button
          onClick={() => navigate("/dashboard")}
          className="rounded-xl px-5 py-3 border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 transition-all duration-200"
        >
          Back to Dashboard
        </button>
      </div>
    </section>
  );
};

export default ReportPage;

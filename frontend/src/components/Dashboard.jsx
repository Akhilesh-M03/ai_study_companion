import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Brain,
  ChartSpline,
  MessageSquareText,
  Rocket,
  FileBarChart2,
  Target,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import WeaknessHeatmap from './WeaknessHeatmap';
import { useAppState } from '../context/AppStateContext';

const formatRelativeTime = (isoDate) => {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.max(1, Math.floor(diffMs / (1000 * 60)));
  if (minutes < 60) {
    return `${minutes}m ago`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }
  return `${Math.floor(hours / 24)}d ago`;
};

const chartDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const buildLinePoints = (series, width, height, padding) => {
  const plotWidth = width - padding * 2;
  const plotHeight = height - padding * 2;

  return series
    .map((item, index) => {
      const x = padding + (index * plotWidth) / Math.max(series.length - 1, 1);
      const y = padding + ((100 - item.accuracy) / 100) * plotHeight;
      return `${x},${y}`;
    })
    .join(' ');
};

const buildAreaPath = (series, width, height, padding) => {
  const plotWidth = width - padding * 2;
  const plotHeight = height - padding * 2;

  if (!series.length) {
    return '';
  }

  const points = series.map((item, index) => {
    const x = padding + (index * plotWidth) / Math.max(series.length - 1, 1);
    const y = padding + ((100 - item.accuracy) / 100) * plotHeight;
    return { x, y };
  });

  const startX = points[0].x;
  const endX = points[points.length - 1].x;
  const baselineY = height - padding;

  const linePart = points.map((point) => `${point.x} ${point.y}`).join(' L ');
  return `M ${startX} ${baselineY} L ${linePart} L ${endX} ${baselineY} Z`;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { averageScore, latestDelta, quizHistory, topicPerformance, weakTopics, userName } = useAppState();

  const sortedImprovements = Object.entries(latestDelta).sort((a, b) => b[1] - a[1]);
  const strongestImprovement = sortedImprovements.find((item) => item[1] > 0);
  const weakTopic = weakTopics[0]?.topic || 'Trigonometry';
  const improvementMessage = strongestImprovement
    ? `You improved in ${strongestImprovement[0]} (+${strongestImprovement[1]}%)`
    : 'You improved in Algebra (+15%)';

  const weeklyAccuracy = chartDays.map((day, index) => {
    const baseline = [56, 59, 63, 67, 71, 74, 78][index];
    const attempt = [...quizHistory].slice(0, 7).reverse()[index];
    return {
      day,
      accuracy: attempt?.score ?? baseline,
    };
  });

  const chartWidth = 560;
  const chartHeight = 220;
  const chartPadding = 18;
  const linePoints = buildLinePoints(weeklyAccuracy, chartWidth, chartHeight, chartPadding);
  const areaPath = buildAreaPath(weeklyAccuracy, chartWidth, chartHeight, chartPadding);

  const weakCount = topicPerformance.filter((topic) => topic.strength <= 40).length;
  const averageCount = topicPerformance.filter((topic) => topic.strength > 40 && topic.strength <= 70).length;
  const strongCount = topicPerformance.filter((topic) => topic.strength > 70).length;
  const totalTopics = Math.max(topicPerformance.length, 1);

  const quickActions = [
    {
      id: 'start-quiz',
      label: 'Start Quiz',
      icon: <Rocket className="w-4 h-4" />,
      onClick: () => navigate('/quiz'),
    },
    {
      id: 'chat-ai',
      label: 'Chat with AI',
      icon: <MessageSquareText className="w-4 h-4" />,
      onClick: () => navigate('/chat'),
    },
    {
      id: 'weak-topics',
      label: 'Practice Weak Topics',
      icon: <Target className="w-4 h-4" />,
      onClick: () => navigate('/quiz', { state: { autoWeak: true } }),
    },
    {
      id: 'report',
      label: 'Generate Report',
      icon: <FileBarChart2 className="w-4 h-4" />,
      onClick: () => navigate('/report'),
    },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-primary/20 bg-card/85 backdrop-blur-xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-28 -left-16 w-72 h-72 rounded-full bg-secondary/20 blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-secondary-text">AI Insight Card</p>
                <h2 className="text-2xl font-black">Welcome back, {userName || 'Learner'}</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="rounded-2xl border border-primary/20 bg-background/55 px-4 py-3">
                <p className="text-sm font-semibold">You are weak in {weakTopic}</p>
              </div>
              <div className="rounded-2xl border border-primary/20 bg-background/55 px-4 py-3">
                <p className="text-sm font-semibold">{improvementMessage}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/quiz', { state: { autoWeak: true } })}
            className="self-start lg:self-center rounded-2xl px-6 py-3.5 bg-primary hover:bg-secondary text-white font-black text-sm transition-all duration-300 shadow-[0_0_25px_var(--color-primary)] hover:shadow-[0_0_35px_var(--color-secondary)]"
          >
            Practice Weak Topics
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className="rounded-2xl border border-primary/20 bg-card/85 backdrop-blur-xl px-5 py-5 text-left hover:border-primary/50 hover:bg-primary/10 transition-all duration-300"
          >
            <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center text-primary">
              {action.icon}
            </div>
            <p className="mt-4 text-sm font-black">{action.label}</p>
            <p className="text-xs text-secondary-text mt-1">Jump directly into this flow</p>
          </button>
        ))}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <article className="xl:col-span-2 rounded-3xl border border-primary/15 bg-card/85 backdrop-blur-xl p-5 md:p-6 shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <ChartSpline className="w-5 h-5 text-secondary" />
              Weakness Heatmap
            </h3>
            <button
              onClick={() => navigate('/quiz', { state: { autoWeak: true } })}
              className="text-xs font-bold text-primary hover:text-secondary transition-colors flex items-center gap-1"
            >
              Practice Weakest
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
          <WeaknessHeatmap items={topicPerformance} />
        </article>

        <article className="rounded-3xl border border-primary/15 bg-card/85 backdrop-blur-xl p-5 md:p-6 shadow-xl space-y-5">
          <div className="flex items-start justify-between">
            <div>
            <p className="text-xs font-bold uppercase tracking-widest text-secondary-text">Performance Breakdown</p>
            <h3 className="text-3xl font-black mt-1">{averageScore}%</h3>
            <p className="text-xs text-secondary-text mt-1">Average score across recent quiz attempts</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Weak Topics</span>
                <span>{weakCount}</span>
              </div>
              <div className="h-2 rounded-full bg-background/60">
                <div className="h-2 rounded-full bg-red-500" style={{ width: `${(weakCount / totalTopics) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Average Topics</span>
                <span>{averageCount}</span>
              </div>
              <div className="h-2 rounded-full bg-background/60">
                <div className="h-2 rounded-full bg-yellow-500" style={{ width: `${(averageCount / totalTopics) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Strong Topics</span>
                <span>{strongCount}</span>
              </div>
              <div className="h-2 rounded-full bg-background/60">
                <div className="h-2 rounded-full bg-green-500" style={{ width: `${(strongCount / totalTopics) * 100}%` }} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-primary/15 bg-background/45 p-3">
            <p className="text-xs text-secondary-text">Current weakest topic</p>
            <p className="text-sm font-bold mt-1">{weakTopics[0] ? weakTopics[0].topic : 'No weak topic detected'}</p>
          </div>
        </article>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <article className="rounded-3xl border border-primary/15 bg-card/85 backdrop-blur-xl p-5 md:p-6 shadow-xl">
          <h3 className="text-lg font-bold mb-5">Progress Graph: Accuracy Over 7 Days</h3>
          <div className="rounded-2xl border border-primary/10 bg-background/50 p-3">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-52">
              <defs>
                <linearGradient id="line-gradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="var(--color-primary)" />
                  <stop offset="100%" stopColor="var(--color-secondary)" />
                </linearGradient>
                <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.03" />
                </linearGradient>
              </defs>

              {[0, 25, 50, 75, 100].map((tick) => {
                const y = chartPadding + ((100 - tick) / 100) * (chartHeight - chartPadding * 2);
                return (
                  <line
                    key={tick}
                    x1={chartPadding}
                    y1={y}
                    x2={chartWidth - chartPadding}
                    y2={y}
                    stroke="rgba(255,255,255,0.08)"
                    strokeDasharray="4 4"
                  />
                );
              })}

              <path d={areaPath} fill="url(#area-gradient)" />
              <polyline points={linePoints} fill="none" stroke="url(#line-gradient)" strokeWidth="4" strokeLinecap="round" />

              {weeklyAccuracy.map((item, index) => {
                const x = chartPadding + (index * (chartWidth - chartPadding * 2)) / Math.max(weeklyAccuracy.length - 1, 1);
                const y = chartPadding + ((100 - item.accuracy) / 100) * (chartHeight - chartPadding * 2);

                return <circle key={item.day} cx={x} cy={y} r="4" fill="var(--color-secondary)" />;
              })}
            </svg>

            <div className="grid grid-cols-7 mt-2">
              {weeklyAccuracy.map((item) => (
                <div key={item.day} className="text-center">
                  <p className="text-[10px] font-bold text-secondary-text">{item.day}</p>
                  <p className="text-[10px] text-primary-text/80">{item.accuracy}%</p>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="rounded-3xl border border-primary/15 bg-card/85 backdrop-blur-xl p-5 md:p-6 shadow-xl">
          <h3 className="text-lg font-bold mb-5">Activity Timeline</h3>
          <div className="relative pl-5 space-y-3 max-h-56 overflow-y-auto pr-1">
            <div className="absolute left-1.5 top-1 bottom-1 w-px bg-primary/25"></div>
            {quizHistory.slice(0, 6).map((attempt) => (
              <div
                key={attempt.id}
                className="relative rounded-2xl border border-primary/10 bg-background/45 px-4 py-3"
              >
                <span className="absolute -left-6 top-5 w-3 h-3 rounded-full bg-primary border-2 border-card"></span>
                <p className="text-sm font-bold">{attempt.source} - {attempt.score}%</p>
                <p className="text-xs text-secondary-text mt-1">{attempt.difficulty} • {formatRelativeTime(attempt.at)}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
};

export default Dashboard;

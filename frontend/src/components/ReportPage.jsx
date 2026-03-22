import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, FileBarChart2 } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';

const ReportPage = () => {
  const navigate = useNavigate();
  const { quizHistory, strongTopics, topicPerformance, weakTopics } = useAppState();

  const trend = useMemo(() => {
    const recent = quizHistory.slice(0, 3);
    const previous = quizHistory.slice(3, 6);

    const recentAvg = recent.length ? recent.reduce((acc, item) => acc + item.score, 0) / recent.length : 0;
    const previousAvg = previous.length
      ? previous.reduce((acc, item) => acc + item.score, 0) / previous.length
      : recentAvg;

    return Math.round(recentAvg - previousAvg);
  }, [quizHistory]);

  return (
    <section className="max-w-6xl mx-auto space-y-6">
      <header className="rounded-3xl border border-primary/15 bg-card/85 backdrop-blur-xl p-6 md:p-8 shadow-2xl">
        <p className="text-xs font-bold uppercase tracking-widest text-secondary-text">Smart Recommendation Flow</p>
        <h2 className="text-3xl font-black mt-2 flex items-center gap-2">
          <FileBarChart2 className="w-7 h-7 text-primary" />
          Learning Report
        </h2>
        <p className="text-sm text-secondary-text mt-2">
          Strengths, weaknesses, and trend signals generated from your latest attempts.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <article className="rounded-3xl border border-primary/15 bg-card/85 backdrop-blur-xl p-5 shadow-xl">
          <p className="text-xs font-bold uppercase tracking-wider text-secondary-text">Trend</p>
          <div className="mt-3 flex items-center gap-2">
            {trend >= 0 ? (
              <TrendingUp className="w-5 h-5 text-green-400" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-400" />
            )}
            <p className={`text-2xl font-black ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>{trend}%</p>
          </div>
          <p className="text-sm text-secondary-text mt-2">Change in average score across recent attempts.</p>
        </article>

        <article className="rounded-3xl border border-primary/15 bg-card/85 backdrop-blur-xl p-5 shadow-xl">
          <p className="text-xs font-bold uppercase tracking-wider text-secondary-text">Strongest Topics</p>
          <div className="mt-3 space-y-2">
            {strongTopics.slice(0, 4).map((item) => (
              <div key={item.topic} className="flex items-center justify-between text-sm">
                <span>{item.topic}</span>
                <span className="font-bold text-green-400">{item.strength}%</span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-primary/15 bg-card/85 backdrop-blur-xl p-5 shadow-xl">
          <p className="text-xs font-bold uppercase tracking-wider text-secondary-text">Weakest Topics</p>
          <div className="mt-3 space-y-2">
            {weakTopics.slice(0, 4).map((item) => (
              <div key={item.topic} className="flex items-center justify-between text-sm">
                <span>{item.topic}</span>
                <span className="font-bold text-red-400">{item.strength}%</span>
              </div>
            ))}
            {!weakTopics.length ? <p className="text-sm text-secondary-text">No weak topics right now.</p> : null}
          </div>
        </article>
      </div>

      <article className="rounded-3xl border border-primary/15 bg-card/85 backdrop-blur-xl p-6 shadow-xl">
        <p className="text-xs font-bold uppercase tracking-wider text-secondary-text">Topic Trends</p>
        <div className="mt-4 space-y-3">
          {topicPerformance.map((item) => (
            <div key={item.topic}>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>{item.subject}: {item.topic}</span>
                <span>{item.strength}%</span>
              </div>
              <div className="h-2 rounded-full bg-background/60">
                <div className="h-2 rounded-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${item.strength}%` }} />
              </div>
            </div>
          ))}
        </div>
      </article>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => navigate('/quiz', { state: { autoWeak: true } })}
          className="rounded-xl bg-primary hover:bg-secondary text-white px-5 py-3 font-bold transition-all duration-300"
        >
          Practice Weak Topics
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="rounded-xl border border-primary/25 bg-background/60 hover:bg-primary/10 px-5 py-3 font-bold transition-all duration-300"
        >
          Back to Dashboard
        </button>
      </div>
    </section>
  );
};

export default ReportPage;

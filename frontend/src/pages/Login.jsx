import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppState } from "../context/AppStateContext";
import UntitledImage from "../assets/Untitled.png";
import {
  Brain,
  Zap,
  Target,
  BarChart3,
  BookOpen,
  MessageSquare,
  Sparkles,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Shared Right-Column Panel (Orbit Layout)
───────────────────────────────────────────── */
function OrbitPanel() {
  const [rotationActive, setRotationActive] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setRotationActive(true), 1450);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex-1 z-50 flex flex-col items-center justify-center h-full">
      {/* Dot-matrix background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(15,23,42,0.08) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-105 h-105 rounded-full bg-emerald-400 opacity-20 blur-[120px] mix-blend-multiply z-0 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-95 h-95 rounded-full bg-sky-400 opacity-20 blur-[120px] mix-blend-multiply z-0 pointer-events-none" />

      {/* Header */}
      <div className="absolute top-10 left-0 right-0 flex flex-col items-center z-20">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-slate-500 text-xs font-mono tracking-[0.25em] uppercase">
            System Active
          </p>
        </div>
        <h2
          className="text-2xl font-black tracking-tight bg-clip-text text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #34d399 0%, #a78bfa 50%, #38bdf8 100%)",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          STUDIQ
        </h2>
        <p className="text-slate-600 text-sm mt-2 font-light tracking-wide">
          Adaptive intelligence that evolves with every learner
        </p>
      </div>

      <div className="absolute inset-0 scale-90 origin-center">
        {/* ── Concentric Rings Intro ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.86 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-100 h-100 rounded-full border border-slate-300/80 z-0"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.86 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full border border-slate-300/60 z-0"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.86 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 rounded-full border border-slate-300/50 z-0"
        />

        {/* ── Ring 1 (400px): Adaptive Quizzes / Topic Insights ── */}
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: rotationActive ? 360 : 0 }}
          transition={
            rotationActive
              ? { duration: 25, repeat: Infinity, ease: "linear" }
              : { duration: 0 }
          }
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
          style={{ width: "400px", height: "400px" }}
        >
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: rotationActive ? -360 : 0 }}
            transition={
              rotationActive
                ? { duration: 25, repeat: Infinity, ease: "linear" }
                : { duration: 0 }
            }
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
          >
            <motion.div
              initial={{ opacity: 0, rotateX: -92, y: -24 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              transition={{
                duration: 0.55,
                delay: 0.75,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ transformPerspective: 1000 }}
            >
              <div className="bg-emerald-600/90 backdrop-blur-md border border-emerald-500 rounded-full px-4 py-2 text-emerald-50 text-sm flex items-center gap-2 shadow-xl shadow-emerald-900/35 whitespace-nowrap">
                <Target size={13} />
                <span className="font-semibold">Adaptive Quizzes</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ rotate: 180 }}
          animate={{ rotate: rotationActive ? 540 : 180 }}
          transition={
            rotationActive
              ? { duration: 25, repeat: Infinity, ease: "linear" }
              : { duration: 0 }
          }
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
          style={{ width: "400px", height: "400px" }}
        >
          <motion.div
            initial={{ rotate: -180 }}
            animate={{ rotate: rotationActive ? -540 : -180 }}
            transition={
              rotationActive
                ? { duration: 25, repeat: Infinity, ease: "linear" }
                : { duration: 0 }
            }
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
          >
            <motion.div
              initial={{ opacity: 0, rotateX: -92, y: -24 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              transition={{
                duration: 0.55,
                delay: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ transformPerspective: 1000 }}
            >
              <div className="bg-teal-900/85 backdrop-blur-md border border-teal-700 rounded-full px-4 py-2 text-teal-200 text-sm flex items-center gap-2 shadow-xl shadow-teal-950/45 whitespace-nowrap">
                <BarChart3 size={13} />
                <span className="font-semibold">Topic Insights</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* ── Ring 2 (600px): AI Tutor Chat / Exam Mode ── */}
        <motion.div
          initial={{ rotate: 90 }}
          animate={{ rotate: rotationActive ? 450 : 90 }}
          transition={
            rotationActive
              ? { duration: 40, repeat: Infinity, ease: "linear" }
              : { duration: 0 }
          }
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
          style={{ width: "600px", height: "600px" }}
        >
          <motion.div
            initial={{ rotate: -90 }}
            animate={{ rotate: rotationActive ? -450 : -90 }}
            transition={
              rotationActive
                ? { duration: 40, repeat: Infinity, ease: "linear" }
                : { duration: 0 }
            }
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
          >
            <motion.div
              initial={{ opacity: 0, rotateX: -92, y: -24 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              transition={{
                duration: 0.55,
                delay: 0.95,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ transformPerspective: 1000 }}
            >
              <div className="bg-blue-900/85 backdrop-blur-md border border-blue-700 rounded-full px-4 py-2 text-blue-200 text-sm flex items-center gap-2 shadow-xl shadow-blue-950/45 whitespace-nowrap">
                <MessageSquare size={13} />
                <span className="font-semibold">AI Tutor Chat</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ rotate: 270 }}
          animate={{ rotate: rotationActive ? 630 : 270 }}
          transition={
            rotationActive
              ? { duration: 40, repeat: Infinity, ease: "linear" }
              : { duration: 0 }
          }
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
          style={{ width: "600px", height: "600px" }}
        >
          <motion.div
            initial={{ rotate: -270 }}
            animate={{ rotate: rotationActive ? -630 : -270 }}
            transition={
              rotationActive
                ? { duration: 40, repeat: Infinity, ease: "linear" }
                : { duration: 0 }
            }
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
          >
            <motion.div
              initial={{ opacity: 0, rotateX: -92, y: -24 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              transition={{
                duration: 0.55,
                delay: 1.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ transformPerspective: 1000 }}
            >
              <div className="bg-rose-800/90 backdrop-blur-md border border-rose-600 rounded-full px-4 py-2 text-rose-100 text-sm flex items-center gap-2 shadow-xl shadow-rose-950/40 whitespace-nowrap">
                <Zap size={13} />
                <span className="font-semibold">Exam Mode</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* ── Ring 3 (800px): AI Insight / Smart Flashcards ── */}
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: rotationActive ? 360 : 0 }}
          transition={
            rotationActive
              ? { duration: 60, repeat: Infinity, ease: "linear" }
              : { duration: 0 }
          }
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
          style={{ width: "800px", height: "800px" }}
        >
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: rotationActive ? -360 : 0 }}
            transition={
              rotationActive
                ? { duration: 60, repeat: Infinity, ease: "linear" }
                : { duration: 0 }
            }
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
          >
            <motion.div
              initial={{ opacity: 0, rotateX: -92, y: -24 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              transition={{
                duration: 0.55,
                delay: 1.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ transformPerspective: 1000 }}
            >
              <div className="bg-lime-900/90 backdrop-blur-md border border-lime-700 rounded-2xl px-4 py-3 shadow-2xl shadow-lime-950/45 whitespace-normal break-words leading-relaxed max-w-[280px]">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-5 h-5 rounded-full bg-linear-to-br from-emerald-400 to-teal-500 flex items-center justify-center shrink-0">
                    <Sparkles size={10} className="text-white" />
                  </div>
                  <span className="text-lime-200 text-xs font-bold">
                    AI Insight
                  </span>
                </div>
                <p className="text-lime-100 text-xs leading-relaxed">
                  Your mastery in{" "}
                  <span className="text-lime-300 font-semibold">Calculus</span>{" "}
                  jumped{" "}
                  <span className="text-lime-300 font-semibold">+18%</span> this
                  week 🚀
                </p>
                <div className="flex gap-1 mt-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-lime-300 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-lime-300 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-lime-300 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ rotate: 180 }}
          animate={{ rotate: rotationActive ? 540 : 180 }}
          transition={
            rotationActive
              ? { duration: 60, repeat: Infinity, ease: "linear" }
              : { duration: 0 }
          }
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
          style={{ width: "800px", height: "800px" }}
        >
          <motion.div
            initial={{ rotate: -180 }}
            animate={{ rotate: rotationActive ? -540 : -180 }}
            transition={
              rotationActive
                ? { duration: 60, repeat: Infinity, ease: "linear" }
                : { duration: 0 }
            }
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
          >
            <motion.div
              initial={{ opacity: 0, rotateX: -92, y: -24 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              transition={{
                duration: 0.55,
                delay: 1.25,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ transformPerspective: 1000 }}
            >
              <div className="bg-violet-900/85 backdrop-blur-md border border-violet-700 rounded-full px-4 py-2 text-violet-200 text-sm flex items-center gap-2 shadow-xl shadow-violet-950/45 whitespace-nowrap">
                <BookOpen size={13} />
                <span className="font-semibold">Smart Flashcards</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* ── Central Illustration ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.72, y: 24, rotateX: -12 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformPerspective: 1000 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[510px] animate-[float_6s_ease-in-out_infinite]"
        >
          <img
            src={UntitledImage}
            alt="Adaptive Learning brain and neural network"
            className="w-full h-auto object-contain drop-shadow-[0_0_40px_rgba(16,185,129,0.35)]"
          />
        </motion.div>
      </div>

      {/* Bottom footnote */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center z-20">
        <p className="text-slate-400 text-xs font-mono tracking-widest">
          POWERED BY ADAPTIVE NEURAL CORE v4.2
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Login Page
───────────────────────────────────────────── */
export default function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { startSession } = useAppState();

  const handleSubmit = () => {
    if (!userName || !password) return;
    setLoading(true);
    setTimeout(() => {
      startSession(userName, { showOnboarding: false });
      navigate("/workspace-loading");
      setLoading(false);
    }, 1800);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="h-screen w-full flex font-sans bg-slate-50 text-slate-800 overflow-hidden">
      {/* ── LEFT COLUMN: Form ── */}
      <div className="flex-1 flex items-center justify-center px-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm"
        >
          {/* Logo mark */}
          <div className="flex items-center gap-2.5 mb-10">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Brain size={18} className="text-white" />
            </div>
            <span
              className="text-slate-900 text-lg font-extrabold tracking-tight"
              style={{
                fontFamily: "'Plus Jakarta Sans', 'Manrope', sans-serif",
              }}
            >
              STUDIQ
            </span>
          </div>

          <h1
            className="text-3xl font-extrabold text-slate-900 mb-1.5 tracking-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', 'Manrope', sans-serif" }}
          >
            Welcome back
          </h1>
          <p
            className="text-slate-600 text-sm mb-9"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            Continue your learning journey where you left off.
          </p>

          {/* Username */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
              Username
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter your username"
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40"
            />
          </div>

          {/* Password */}
          <div className="mb-7">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest">
                Password
              </label>
              <a
                href="#"
                className="text-xs text-emerald-600 hover:text-emerald-500 font-medium transition-colors"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="••••••••"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 pr-12 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 shadow-[0_4px_14px_0_rgba(16,185,129,0.39)]"
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              />
            ) : (
              <>
                Sign in
                <ArrowRight size={15} />
              </>
            )}
          </motion.button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-7">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-slate-400 text-xs">or</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <p className="text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-emerald-600 hover:text-emerald-500 font-semibold transition-colors"
            >
              Create one
            </a>
          </p>
        </motion.div>
      </div>

      {/* ── RIGHT COLUMN: Orbit Panel ── */}
      <OrbitPanel />
    </div>
  );
}

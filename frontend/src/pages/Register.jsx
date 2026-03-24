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
  Check,
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
            Onboarding Module
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
          Your personalized intelligence begins here
        </p>
      </div>

      <div className="absolute inset-0 scale-90 origin-center">
        {/* ── Concentric Ring 1: 400px ── */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-100 h-100 rounded-full border border-slate-300/80 z-0" />

        {/* ── Concentric Ring 2: 600px ── */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full border border-slate-300/60 z-0" />

        {/* ── Concentric Ring 3: 800px ── */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 rounded-full border border-slate-300/50 z-0" />

        {/* ── Ring 1 (400px): Adaptive Quizzes / Topic Insights ── */}
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
          style={{ width: "400px", height: "400px" }}
        >
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
          >
            <div className="bg-emerald-600/90 backdrop-blur-md border border-emerald-500 rounded-full px-4 py-2 text-emerald-50 text-sm flex items-center gap-2 shadow-xl shadow-emerald-900/35 whitespace-nowrap">
              <Target size={13} />
              <span className="font-semibold">Adaptive Quizzes</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ rotate: 180 }}
          animate={{ rotate: 540 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
          style={{ width: "400px", height: "400px" }}
        >
          <motion.div
            initial={{ rotate: -180 }}
            animate={{ rotate: -540 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
          >
            <div className="bg-teal-900/85 backdrop-blur-md border border-teal-700 rounded-full px-4 py-2 text-teal-200 text-sm flex items-center gap-2 shadow-xl shadow-teal-950/45 whitespace-nowrap">
              <BarChart3 size={13} />
              <span className="font-semibold">Topic Insights</span>
            </div>
          </motion.div>
        </motion.div>

        {/* ── Ring 2 (600px): AI Tutor Chat / Exam Mode ── */}
        <motion.div
          initial={{ rotate: 90 }}
          animate={{ rotate: 450 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
          style={{ width: "600px", height: "600px" }}
        >
          <motion.div
            initial={{ rotate: -90 }}
            animate={{ rotate: -450 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
          >
            <div className="bg-blue-900/85 backdrop-blur-md border border-blue-700 rounded-full px-4 py-2 text-blue-200 text-sm flex items-center gap-2 shadow-xl shadow-blue-950/45 whitespace-nowrap">
              <MessageSquare size={13} />
              <span className="font-semibold">AI Tutor Chat</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ rotate: 270 }}
          animate={{ rotate: 630 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
          style={{ width: "600px", height: "600px" }}
        >
          <motion.div
            initial={{ rotate: -270 }}
            animate={{ rotate: -630 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
          >
            <div className="bg-rose-800/90 backdrop-blur-md border border-rose-600 rounded-full px-4 py-2 text-rose-100 text-sm flex items-center gap-2 shadow-xl shadow-rose-950/40 whitespace-nowrap">
              <Zap size={13} />
              <span className="font-semibold">Exam Mode</span>
            </div>
          </motion.div>
        </motion.div>

        {/* ── Ring 3 (800px): AI Insight / Smart Flashcards ── */}
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
          style={{ width: "800px", height: "800px" }}
        >
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: -360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
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
                jumped <span className="text-lime-300 font-semibold">+18%</span>{" "}
                this week 🚀
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

        <motion.div
          initial={{ rotate: 180 }}
          animate={{ rotate: 540 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
          style={{ width: "800px", height: "800px" }}
        >
          <motion.div
            initial={{ rotate: -180 }}
            animate={{ rotate: -540 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
          >
            <div className="bg-violet-900/85 backdrop-blur-md border border-violet-700 rounded-full px-4 py-2 text-violet-200 text-sm flex items-center gap-2 shadow-xl shadow-violet-950/45 whitespace-nowrap">
              <BookOpen size={13} />
              <span className="font-semibold">Smart Flashcards</span>
            </div>
          </motion.div>
        </motion.div>

        {/* ── Central Illustration ── */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[510px] animate-[float_6s_ease-in-out_infinite]">
          <img
            src={UntitledImage}
            alt="Adaptive Learning brain and neural network"
            className="w-full h-auto object-contain drop-shadow-[0_0_40px_rgba(16,185,129,0.35)]"
          />
        </div>
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
   Register Page
───────────────────────────────────────────── */
export default function Register() {
  const [form, setForm] = useState({
    userName: "",
    password: "",
    confirm: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();
  const { startSession } = useAppState();

  const update = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });

  const handleSubmit = () => {
    const allFilled = Object.values(form).every(Boolean);
    if (!allFilled || !agreed) return;
    setLoading(true);
    setTimeout(() => {
      startSession(form.userName, { showOnboarding: true });
      navigate("/dashboard");
      setLoading(false);
    }, 1800);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  /* password strength */
  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = [
    "",
    "bg-red-500",
    "bg-yellow-400",
    "bg-emerald-400",
    "bg-emerald-500",
  ][strength];

  return (
    <div className="h-screen w-full flex font-sans bg-slate-50 text-slate-800 overflow-hidden">
      {/* ── LEFT COLUMN: Form ── */}
      <div className="flex-1 flex items-center justify-center px-10 overflow-y-auto py-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm"
        >
          {/* Logo mark */}
          <div className="flex items-center gap-2.5 mb-8">
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
            Create account
          </h1>
          <p
            className="text-slate-600 text-sm mb-8"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            Join thousands of learners on the adaptive network.
          </p>

          {/* Username */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
              Username
            </label>
            <input
              type="text"
              value={form.userName}
              onChange={update("userName")}
              onKeyDown={handleKeyDown}
              placeholder="Enter your username"
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40"
            />
          </div>

          {/* Password */}
          <div className="mb-2">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={update("password")}
                onKeyDown={handleKeyDown}
                placeholder="Min. 8 characters"
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

          {/* Strength bar */}
          {form.password && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      i <= strength ? strengthColor : "bg-slate-700"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-500">
                Password strength:{" "}
                <span
                  className={`font-semibold ${
                    strength === 1
                      ? "text-red-400"
                      : strength === 2
                        ? "text-yellow-400"
                        : "text-emerald-400"
                  }`}
                >
                  {strengthLabel}
                </span>
              </p>
            </motion.div>
          )}

          {/* Confirm password */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={form.confirm}
                onChange={update("confirm")}
                onKeyDown={handleKeyDown}
                placeholder="Repeat password"
                className={`w-full bg-white border rounded-xl px-4 py-3.5 pr-12 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200 focus:ring-1 ${
                  form.confirm && form.confirm !== form.password
                    ? "border-red-500 focus:border-red-400 focus:ring-red-500"
                    : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/40"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              {form.confirm && form.confirm === form.password && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute right-10 top-1/2 -translate-y-1/2"
                >
                  <Check size={14} className="text-emerald-400" />
                </motion.div>
              )}
            </div>
            {form.confirm && form.confirm !== form.password && (
              <p className="text-xs text-red-400 mt-1.5">
                Passwords do not match
              </p>
            )}
          </div>

          {/* Terms checkbox */}
          <div className="flex items-start gap-3 mb-7">
            <button
              type="button"
              onClick={() => setAgreed(!agreed)}
              className={`mt-0.5 w-5 h-5 rounded-md border-2 shrink-0 flex items-center justify-center transition-all duration-200 ${
                agreed
                  ? "bg-emerald-500 border-emerald-500"
                  : "border-slate-300 bg-white"
              }`}
            >
              {agreed && (
                <Check size={11} className="text-white" strokeWidth={3} />
              )}
            </button>
            <p className="text-xs text-slate-600 leading-relaxed">
              I agree to the{" "}
              <a
                href="#"
                className="text-emerald-600 hover:text-emerald-500 font-medium"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-emerald-600 hover:text-emerald-500 font-medium"
              >
                Privacy Policy
              </a>
            </p>
          </div>

          {/* Submit */}
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
                Create account
                <ArrowRight size={15} />
              </>
            )}
          </motion.button>

          <p className="text-center text-sm text-slate-600 mt-6">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-emerald-600 hover:text-emerald-500 font-semibold transition-colors"
            >
              Sign in
            </a>
          </p>
        </motion.div>
      </div>

      {/* ── RIGHT COLUMN: Orbit Panel ── */}
      <OrbitPanel />
    </div>
  );
}

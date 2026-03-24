import { useEffect, useState, useRef } from "react";
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
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shrink-0">
                  <Sparkles size={10} className="text-white" />
                </div>
                <span className="text-lime-200 text-xs font-bold">
                  AI Insight
                </span>
              </div>
              <p className="text-lime-100 text-xs leading-relaxed">
                Your mastery in{" "}
                <span className="text-lime-300 font-semibold">Web Dev</span> jumped{" "}
                <span className="text-lime-300 font-semibold">+22%</span> this week 📈
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
            <div className="bg-indigo-900/90 backdrop-blur-md border border-indigo-700 rounded-2xl px-4 py-3 shadow-2xl shadow-indigo-950/45 whitespace-normal break-words leading-relaxed max-w-[280px]">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center shrink-0">
                  <Check size={10} className="text-white" />
                </div>
                <span className="text-indigo-200 text-xs font-bold">
                  Smart Tips
                </span>
              </div>
              <p className="text-indigo-100 text-xs leading-relaxed">
                Focus on <span className="text-indigo-300 font-semibold">async/await</span> patterns. Practice through our{" "}
                <span className="text-indigo-300 font-semibold">flashcards</span>.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Register Component with Integrated Form
───────────────────────────────────────────── */
const Register = () => {
  const navigate = useNavigate();
  const { registerAndLogin } = useAppState();
  const formRef = useRef(null);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();

    if (
      !username.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setErrorMessage("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await registerAndLogin({ username, email, password });
      navigate("/dashboard");
    } catch (error) {
      const message =
        typeof error?.message === "string"
          ? error.message
          : "Unable to create your account right now.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
        {/* ── LEFT COLUMN: Registration Form ── */}
        <section className="flex items-center justify-center bg-white px-6 py-10 md:px-10 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-md"
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
              Get started
            </h1>
            <p
              className="text-slate-600 text-sm mb-9"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              Create your account and begin your personalized learning journey.
            </p>

            <form ref={formRef} onSubmit={handleRegister} className="space-y-5">
              {/* Username */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Choose your username"
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="your@email.com"
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="At least 8 characters"
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

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Repeat your password"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 pr-12 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error message */}
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}

              {/* Submit button */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 shadow-[0_4px_14px_0_rgba(16,185,129,0.39)]"
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={15} />
                  </>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-7">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-slate-400 text-xs">or</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            <p className="text-center text-sm text-slate-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-emerald-600 hover:text-emerald-500 font-semibold transition-colors"
              >
                Sign in
              </a>
            </p>
          </motion.div>
        </section>

        {/* ── RIGHT COLUMN: Orbit Panel ── */}
        <OrbitPanel />
      </div>
    </div>
  );
};

export default Register;

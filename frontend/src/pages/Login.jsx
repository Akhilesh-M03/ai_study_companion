import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useAppState } from "../context/AppStateContext";
import aiVisual from "../assets/image (7).png";

const Login = () => {
  const MotionDiv = motion.div;
  const MotionButton = motion.button;
  const navigate = useNavigate();
  const { loginWithCredentials } = useAppState();
  const formRef = useRef(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!username.trim() || !password.trim()) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await loginWithCredentials({ username, password });
      navigate("/dashboard");
    } catch (error) {
      const message =
        typeof error?.message === "string"
          ? error.message
          : "Unable to sign in right now.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordEnter = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  return (
    <div className="min-h-screen w-full bg-white text-slate-900">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
        <section className="flex items-center justify-center bg-white px-6 py-10 md:px-10 lg:px-16">
          <MotionDiv
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="w-full max-w-md text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-emerald-700">
              <Sparkles className="h-3.5 w-3.5" />
              Start Your Journey
            </div>

            <h1 className="mt-5 text-4xl font-black leading-tight text-slate-900">
              Adaptive Learning
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Sign in to unlock your personalized AI tutor and real-time
              progress insights.
            </p>

            <form
              ref={formRef}
              onSubmit={handleLogin}
              className="mt-8 space-y-4 text-left"
            >
              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-slate-500"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="your_username"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-sm text-slate-800 outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-slate-500"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  onKeyDown={handlePasswordEnter}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-sm text-slate-800 outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  required
                />
              </div>

              <MotionButton
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={isSubmitting}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 text-sm font-black text-white shadow-[var(--cta-glow)] transition-colors duration-200 hover:bg-emerald-600"
              >
                {isSubmitting ? "Signing in..." : "Login"}
                <ArrowRight className="h-4 w-4" />
              </MotionButton>

              {errorMessage ? (
                <p className="text-xs font-semibold text-rose-600 text-center">
                  {errorMessage}
                </p>
              ) : null}

              <button
                type="button"
                className="w-full rounded-xl border border-slate-200 bg-white py-3 text-sm font-bold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
              >
                Continue with Google
              </button>
            </form>

            <p className="mt-6 text-sm text-slate-500 text-center">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="font-bold text-blue-600 transition-colors hover:text-blue-700"
              >
                Register here
              </Link>
            </p>
          </MotionDiv>
        </section>

        <section className="relative hidden items-center justify-center overflow-hidden bg-gradient-to-br from-teal-50 via-white to-indigo-50 p-8 md:flex lg:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(16,185,129,0.16),transparent_42%),radial-gradient(circle_at_80%_18%,rgba(79,70,229,0.18),transparent_40%)]" />

          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.08 }}
            className="relative z-10 w-full max-w-xl rounded-[2rem] border border-white/70 bg-white/50 p-6 shadow-[0_30px_70px_rgba(16,24,40,0.25)] backdrop-blur-2xl"
          >
            <img
              src={aiVisual}
              alt="AI network visualization"
              className="h-auto w-full rounded-[1.6rem] object-cover"
            />
            <span className="absolute right-7 top-7 rounded-full border border-white/60 bg-slate-900/90 px-3 py-1 text-xs font-bold text-white">
              Adaptive signals
            </span>
            <span className="absolute bottom-7 left-7 rounded-full border border-white/60 bg-slate-900/90 px-3 py-1 text-xs font-bold text-white">
              Neural insights
            </span>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default Login;

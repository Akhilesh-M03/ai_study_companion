import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Mail, User } from "lucide-react";
import { useAppState } from "../context/AppStateContext";
import aiVisual from "../assets/image (7).png";

const Register = () => {
  const navigate = useNavigate();
  const { registerAndLogin } = useAppState();
  const formRef = useRef(null);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

  const handleEnterSubmit = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden w-full bg-slate-950 text-white grid grid-cols-1 md:grid-cols-2">
      <section className="flex h-full items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-800 px-6 py-10 md:px-10 lg:px-16">
        <div className="w-full max-w-md space-y-5 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-200 border border-white/20">
            Start your journey
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-black leading-tight">
              Personalized AI Curriculum
            </h1>
            <p className="text-sm text-indigo-100/90">
              Welcome aboard! Tell us about you so we can generate a tailored
              learning path with adaptive feedback.
            </p>
          </div>

          <form
            ref={formRef}
            onSubmit={handleRegister}
            className="mt-4 space-y-3 text-left"
          >
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-200" />
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                onKeyDown={handleEnterSubmit}
                placeholder="Username"
                className="w-full rounded-xl border border-white/20 bg-white/5 py-3 pl-10 pr-4 text-sm text-white outline-none transition-all focus:border-emerald-300 focus:ring-2 focus:ring-emerald-200/60"
                required
              />
            </div>

            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-200" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                onKeyDown={handleEnterSubmit}
                placeholder="Email"
                className="w-full rounded-xl border border-white/20 bg-white/5 py-3 pl-10 pr-4 text-sm text-white outline-none transition-all focus:border-emerald-300 focus:ring-2 focus:ring-emerald-200/60"
                required
              />
            </div>

            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-200" />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                onKeyDown={handleEnterSubmit}
                placeholder="Password"
                className="w-full rounded-xl border border-white/20 bg-white/5 py-3 pl-10 pr-4 text-sm text-white outline-none transition-all focus:border-emerald-300 focus:ring-2 focus:ring-emerald-200/60"
                required
              />
            </div>

            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-200" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                onKeyDown={handleEnterSubmit}
                placeholder="Confirm Password"
                className="w-full rounded-xl border border-white/20 bg-white/5 py-3 pl-10 pr-4 text-sm text-white outline-none transition-all focus:border-emerald-300 focus:ring-2 focus:ring-emerald-200/60"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 text-sm font-black text-white shadow-[var(--cta-glow)] transition-colors duration-200 hover:bg-emerald-600"
            >
              {isSubmitting ? "Creating Account..." : "Generate My AI Tutor"}
              <ArrowRight className="h-4 w-4" />
            </button>

            {errorMessage ? (
              <p className="text-xs font-semibold text-rose-200 text-center">
                {errorMessage}
              </p>
            ) : null}
          </form>

          <p className="text-sm text-indigo-100/80 text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-emerald-200 transition-colors hover:text-emerald-100"
            >
              Login here
            </Link>
          </p>
        </div>
      </section>

      <section className="hidden md:flex h-full items-center justify-center bg-gradient-to-br from-teal-50 via-white to-indigo-50 p-10 lg:p-14">
        <div className="relative w-full max-w-xl rounded-[2rem] border border-white/70 bg-white/55 p-6 shadow-[0_30px_70px_rgba(16,24,40,0.25)] backdrop-blur-2xl">
          <img
            src={aiVisual}
            alt="AI network visualization"
            className="w-full rounded-[1.6rem] object-cover"
          />
          <span className="absolute right-7 top-7 rounded-full border border-white/60 bg-slate-900/90 px-3 py-1 text-xs font-bold text-white">
            Neural fabric
          </span>
          <span className="absolute bottom-7 left-7 rounded-full border border-white/60 bg-slate-900/90 px-3 py-1 text-xs font-bold text-white">
            Cohort-ready
          </span>
        </div>
      </section>
    </div>
  );
};

export default Register;

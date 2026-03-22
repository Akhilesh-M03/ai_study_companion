import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';

const Login = () => {
  const navigate = useNavigate();
  const { startSession } = useAppState();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (event) => {
    event.preventDefault();
    if (!username.trim() || !password.trim()) {
      return;
    }

    startSession(username);
    navigate('/dashboard');
  };

  return (
    <div className="h-screen w-full flex flex-col md:flex-row bg-[var(--bg)] text-[var(--text-primary)] font-sans overflow-hidden">
      <section className="w-full md:w-1/2 h-full flex flex-col bg-[var(--bg)] border-b md:border-b-0 md:border-r border-[var(--primary)]/20">
        <div className="flex-1 flex items-center justify-center px-6 md:px-10 lg:px-14 py-8">
          <div className="w-full max-w-md rounded-3xl border border-[var(--primary)]/25 bg-[var(--card)]/70 backdrop-blur-xl shadow-2xl p-6 md:p-8">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[var(--primary)]">
                <Sparkles className="w-3.5 h-3.5" />
                Secure Login
              </div>
              <h1 className="mt-4 text-3xl font-black tracking-tight text-[var(--text-primary)]">Welcome Back</h1>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">Sign in to continue your adaptive learning journey.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-2">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="Enter your username"
                  className="w-full rounded-xl border border-[var(--primary)]/25 bg-[var(--bg)]/70 px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/70 outline-none focus:ring-2 focus:ring-[var(--primary)]/70"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-[var(--primary)]/25 bg-[var(--bg)]/70 px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/70 outline-none focus:ring-2 focus:ring-[var(--primary)]/70"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full mt-1 rounded-xl bg-[var(--primary)] text-white py-3.5 text-sm font-black tracking-wide transition-all duration-300 hover:bg-[var(--secondary)] hover:-translate-y-0.5 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                Login
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <p className="mt-5 text-sm text-[var(--text-secondary)]">
              New user?{' '}
              <Link to="/register" className="font-bold text-[var(--primary)] hover:text-[var(--secondary)] transition-colors">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="w-full md:w-1/2 h-full relative overflow-hidden flex items-center justify-center px-6 md:px-10 lg:px-14 py-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 22% 24%, color-mix(in srgb, var(--primary) 32%, transparent) 0%, transparent 46%), radial-gradient(circle at 84% 78%, color-mix(in srgb, var(--secondary) 30%, transparent) 0%, transparent 47%), linear-gradient(160deg, color-mix(in srgb, var(--bg) 25%, black) 0%, var(--bg) 100%)',
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,rgba(255,255,255,0.04),transparent_35%)]" />

        <div className="relative z-10 max-w-lg text-center md:text-left">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--secondary)]/90 mb-4">Adaptive Intelligence</p>
          <h2 className="text-6xl md:text-7xl font-black leading-none text-white">
            StudIQ
          </h2>
          <p className="mt-6 text-base md:text-lg leading-relaxed text-white/85">
            Your Adaptive AI Learning Companion. Master any subject with intelligent, personalized tutoring.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Login;

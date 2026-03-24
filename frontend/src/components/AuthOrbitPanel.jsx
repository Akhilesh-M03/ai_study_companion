import React from "react";
import { motion } from "framer-motion";
import { Brain, MessageSquare, TrendingUp } from "lucide-react";

const AuthOrbitPanel = () => {
  return (
    <section className="relative hidden overflow-hidden bg-slate-950 md:flex md:items-center md:justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.95)_1px,transparent_0)] bg-size-[22px_22px] opacity-[0.05]" />

      <div className="pointer-events-none absolute -left-20 -top-20 h-125 w-125 animate-pulse rounded-full bg-emerald-500/20 blur-[120px] mix-blend-screen" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-125 w-125 rounded-full bg-indigo-600/20 blur-[120px] mix-blend-screen" />

      <div className="relative flex h-full w-full items-center justify-center px-6 py-10">
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-700/40" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-700/40" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-700/40" />

        <div className="pointer-events-none absolute left-1/2 top-10 z-10 -translate-x-1/2 text-center">
          <h2 className="bg-gradient-to-r from-white via-emerald-100 to-indigo-200 bg-clip-text text-2xl font-black tracking-[0.12em] text-transparent lg:text-3xl">
            AUTONOMOUS LEARNING NETWORK
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-300">
            StudIQ&apos;s Adaptive Engine analyzes your proficiency across OOSE,
            Machine Learning, and DSA, continuously generating targeted drills
            to optimize your learning curve.
          </p>
        </div>

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute left-1/2 top-1/2 z-0 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        >
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
          >
            <div className="flex items-center gap-2 whitespace-nowrap rounded-full border border-slate-600 bg-slate-800 px-4 py-2 text-sm text-emerald-400 shadow-lg">
              <Brain className="h-4 w-4" />
              Targeted Drills
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 56, repeat: Infinity, ease: "linear" }}
          className="absolute left-1/2 top-1/2 z-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 56, repeat: Infinity, ease: "linear" }}
            className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
          >
            <div className="flex items-center gap-2 whitespace-nowrap rounded-full border border-slate-600 bg-slate-800 px-4 py-2 text-sm text-emerald-400 shadow-lg">
              <MessageSquare className="h-4 w-4" />
              AI Explainer
            </div>
          </motion.div>

          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 56, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 pointer-events-auto"
          >
            <div className="flex items-center gap-2 whitespace-nowrap rounded-full border border-slate-600 bg-slate-800 px-4 py-2 text-sm text-emerald-400 shadow-lg">
              <TrendingUp className="h-4 w-4" />
              Learning Analytics
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 72, repeat: Infinity, ease: "linear" }}
          className="absolute left-1/2 top-1/2 z-0 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        >
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 72, repeat: Infinity, ease: "linear" }}
            className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 pointer-events-auto"
          >
            <div className="max-w-[280px] rounded-2xl border border-slate-700 bg-slate-900/85 px-4 py-3 text-xs leading-relaxed text-emerald-400 shadow-xl backdrop-blur-xl">
              Your weakness in Binary Trees has been identified. Generating
              custom drill...
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-1/2 z-10 w-[400px] -translate-x-1/2 -translate-y-1/2 scale-105 rounded-2xl border border-white/10 bg-white/5 p-6 text-left shadow-2xl backdrop-blur-2xl -rotate-y-12 rotate-x-12"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-300">
            PROFICIENCY HEATMAP
          </p>
          <div className="mt-3 grid grid-cols-4 gap-2">
            <div className="h-6 rounded-md bg-emerald-500" />
            <div className="h-6 rounded-md bg-emerald-500" />
            <div className="h-6 rounded-md bg-emerald-500" />
            <div className="h-6 rounded-md bg-emerald-500" />
            <div className="h-6 rounded-md bg-yellow-500" />
            <div className="h-6 rounded-md bg-yellow-500" />
            <div className="h-6 rounded-md bg-red-500" />
            <div className="h-6 rounded-md bg-red-500" />
          </div>

          <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-300">
            ADAPTIVE BAR TREND
          </p>
          <div className="flex items-end gap-2 h-20 mt-4">
            <div
              className="w-full rounded-t-md bg-gradient-to-t from-emerald-500 to-emerald-300"
              style={{ height: "40%" }}
            />
            <div
              className="w-full rounded-t-md bg-gradient-to-t from-emerald-500 to-emerald-300"
              style={{ height: "70%" }}
            />
            <div
              className="w-full rounded-t-md bg-gradient-to-t from-emerald-500 to-emerald-300"
              style={{ height: "50%" }}
            />
            <div
              className="w-full rounded-t-md bg-gradient-to-t from-emerald-500 to-emerald-300"
              style={{ height: "90%" }}
            />
            <div
              className="w-full rounded-t-md bg-gradient-to-t from-emerald-500 to-emerald-300"
              style={{ height: "65%" }}
            />
            <div
              className="w-full rounded-t-md bg-gradient-to-t from-emerald-500 to-emerald-300"
              style={{ height: "82%" }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AuthOrbitPanel;

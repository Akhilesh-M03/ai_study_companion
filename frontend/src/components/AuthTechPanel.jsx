import React from "react";
import { motion } from "framer-motion";
import { Brain, MessageSquareText, TrendingUp } from "lucide-react";

const orbitNodes = [
  {
    id: "node-1",
    Icon: Brain,
    label: "TARGETED DRILLS",
    duration: 4.8,
    delay: 0,
    positionClass: "-top-8 left-1/2 -translate-x-[78%]",
    driftX: [0, 16, -8, 0],
    driftY: [0, -10, 6, 0],
    driftRotate: [-4, 2, -3, -4],
  },
  {
    id: "node-2",
    Icon: MessageSquareText,
    label: "AI EXPLAINER",
    duration: 5.6,
    delay: 1.4,
    positionClass: "top-1/2 -right-10 -translate-y-[82%]",
    driftX: [0, 10, 0, -10, 0],
    driftY: [0, -12, 8, -4, 0],
    driftRotate: [3, -2, 4, -1, 3],
  },
  {
    id: "node-3",
    Icon: TrendingUp,
    label: "LEARNING ANALYTICS",
    duration: 6.2,
    delay: 2.1,
    positionClass: "left-1/2 -bottom-10 -translate-x-[18%]",
    driftX: [0, -12, 14, 0],
    driftY: [0, 10, -8, 0],
    driftRotate: [2, -3, 3, 2],
  },
];

const heatmapCells = [
  "bg-red-500",
  "bg-yellow-500",
  "bg-emerald-500",
  "bg-emerald-500",
  "bg-yellow-500",
  "bg-emerald-500",
  "bg-red-500",
  "bg-emerald-500",
  "bg-emerald-500",
  "bg-yellow-500",
  "bg-emerald-500",
  "bg-red-500",
];

const AuthTechPanel = () => {
  return (
    <section className="font-['Manrope','Segoe_UI',sans-serif] relative hidden h-full w-full items-center justify-center overflow-hidden bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900 p-12 md:flex">
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.22)_1px,transparent_1px)] bg-size-[28px_28px]" />
      <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-size-[56px_56px]" />

      <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-emerald-500/30 mix-blend-screen blur-[100px] animate-[blob_18s_ease-in-out_infinite]" />
      <div className="absolute right-1/4 bottom-1/4 h-72 w-72 rounded-full bg-purple-500/30 mix-blend-screen blur-[100px] animate-[blob_22s_ease-in-out_infinite] [animation-delay:1800ms]" />

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          33% { transform: translate3d(34px, -22px, 0) scale(1.08); }
          66% { transform: translate3d(-26px, 20px, 0) scale(0.94); }
        }

        @keyframes chartPulse {
          0%, 100% { opacity: 0.45; }
          50% { opacity: 0.95; }
        }
      `}</style>

      <div className="relative z-20 mx-auto flex h-full w-full max-w-3xl flex-col items-center justify-center text-center">
        <h2 className="font-['Plus_Jakarta_Sans','Manrope',sans-serif] text-5xl font-extrabold leading-tight text-white [text-shadow:0_0_28px_rgba(56,189,248,0.22)]">
          AUTONOMOUS LEARNING NETWORK
        </h2>

        <div className="relative mt-16 h-128 w-136 transform-3d">
          <motion.div
            initial={{ opacity: 0, y: 24, rotateX: 0 }}
            animate={{ opacity: 1, y: 0, rotateX: 12 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="absolute inset-0 m-auto h-96 w-100 transform-[perspective(1600px)_rotateY(12deg)_rotateX(12deg)_scale(1.05)] rounded-2xl border border-white/20 bg-white/10 p-6 shadow-[0_38px_90px_rgba(0,0,0,0.5)] backdrop-blur-xl"
          >
            <div className="space-y-4 text-left">
              <p className="font-['Plus_Jakarta_Sans','Manrope',sans-serif] text-sm font-bold tracking-[0.14em] text-white/90">
                PROFICIENCY HEATMAP
              </p>

              <div className="grid grid-cols-4 gap-2">
                {heatmapCells.map((cell, idx) => (
                  <motion.div
                    key={`${cell}-${idx}`}
                    initial={{ opacity: 0.45, scale: 0.88 }}
                    animate={{
                      opacity: [0.55, 1, 0.55],
                      scale: [0.92, 1, 0.92],
                    }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      delay: idx * 0.08,
                      ease: "easeInOut",
                    }}
                    className={`h-9 rounded-md ${cell}`}
                  />
                ))}
              </div>

              <div className="pt-2">
                <p className="font-['Plus_Jakarta_Sans','Manrope',sans-serif] mb-2 text-xs font-semibold tracking-[0.12em] text-white/70">
                  ADAPTIVE BAR TREND
                </p>
                <div className="flex h-28 items-end gap-2 rounded-xl border border-white/15 bg-white/5 p-3">
                  {[36, 52, 44, 68, 74, 61, 82, 93].map((height, idx) => (
                    <motion.div
                      key={`bar-${height}-${idx}`}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{
                        duration: 0.7,
                        delay: idx * 0.09,
                        repeat: Infinity,
                        repeatType: "reverse",
                        repeatDelay: 1.2,
                      }}
                      className="w-full rounded-sm bg-linear-to-t from-orange-500/85 to-orange-200/65"
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute inset-x-10 top-10 h-px bg-linear-to-r from-transparent via-white/55 to-transparent animate-[chartPulse_3s_ease-in-out_infinite]" />
          </motion.div>

          {orbitNodes.map(
            ({
              id,
              Icon,
              label,
              duration,
              delay,
              positionClass,
              driftX,
              driftY,
              driftRotate,
            }) => (
              <motion.div
                key={id}
                className={`absolute z-30 ${positionClass}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  x: driftX,
                  y: driftY,
                  rotate: driftRotate,
                }}
                transition={{
                  opacity: { duration: 0.45, delay },
                  x: {
                    duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay,
                  },
                  y: {
                    duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay,
                  },
                  rotate: {
                    duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay,
                  },
                }}
              >
                <div className="w-44 rounded-2xl border border-white/25 bg-white/12 p-3 text-left shadow-[0_16px_40px_rgba(0,0,0,0.45)] backdrop-blur-lg">
                  <div className="mb-1.5 flex items-center gap-2 text-emerald-300">
                    <Icon className="h-4 w-4" />
                    <span className="font-['Plus_Jakarta_Sans','Manrope',sans-serif] text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">
                      Node
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-white">{label}</p>
                </div>
              </motion.div>
            ),
          )}
        </div>
      </div>
    </section>
  );
};

export default AuthTechPanel;

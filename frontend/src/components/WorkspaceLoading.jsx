import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import UntitledImage from "../assets/Untitled.png";
import "./WorkspaceLoading.css";

const MAX_PROGRESS = 100;

const WorkspaceLoading = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  const statusText = useMemo(() => {
    if (progress < 35) {
      return "Synchronizing";
    }
    if (progress < 70) {
      return "Calibrating";
    }
    return "Finalizing";
  }, [progress]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= MAX_PROGRESS) {
          window.clearInterval(interval);
          return MAX_PROGRESS;
        }

        const increment = Math.floor(Math.random() * 3) + 1;
        return Math.min(prev + increment, MAX_PROGRESS);
      });
    }, 100);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (progress !== MAX_PROGRESS) {
      return;
    }

    const timeout = window.setTimeout(() => {
      navigate("/dashboard", { replace: true });
    }, 450);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [navigate, progress]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black px-4 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.16),transparent_60%)]" />

      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-purple-600/20 blur-[80px] animate-pulse" />

        <img
          src={UntitledImage}
          alt="Neural network workspace synchronization"
          className="relative z-10 h-auto w-80 animate-[softPulse_4s_ease-in-out_infinite] md:w-md"
        />

        <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 opacity-20">
          <span className="text-8xl font-black text-purple-400/30 tabular-nums">
            {String(progress).padStart(2, "0")}
          </span>
        </div>
      </div>

      <div className="relative z-30 mt-8 text-center">
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-orange-400">
          Loading workspace
        </p>
        <div className="mb-2 flex items-center justify-center space-x-3">
          <span className="h-px w-8 bg-linear-to-r from-transparent to-orange-500" />
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-orange-400">
            {statusText}
          </span>
          <span className="h-px w-8 bg-linear-to-l from-transparent to-orange-500" />
        </div>

        <div className="text-5xl font-light tracking-tight tabular-nums">
          <span>{progress}</span>
          <span className="text-purple-400">%</span>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceLoading;

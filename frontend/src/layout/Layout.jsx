import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import OnboardingModal from "../components/OnboardingModal";
import { useAppState } from "../context/AppStateContext";

const pageLabelMap = {
  dashboard: "Dashboard",
  quiz: "Quiz",
  exam: "Exam Mode",
  chat: "AI Chat",
  report: "Report",
  flashcards: "Flashcards",
  profile: "Profile",
};

const Layout = () => {
  const { completeOnboarding, isOnboardingOpen } = useAppState();
  const location = useLocation();
  const navigate = useNavigate();

  const segment =
    location.pathname.split("/").filter(Boolean)[0] || "dashboard";
  const currentPageLabel = pageLabelMap[segment] || "Dashboard";

  const handleOnboardingComplete = (payload) => {
    completeOnboarding(payload);
    navigate("/workspace-loading", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      <Sidebar />

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onComplete={handleOnboardingComplete}
      />

      <div className="flex-1 ml-16 min-h-screen flex flex-col">
        <header className="sticky top-0 z-10 h-20 flex items-center px-8 border-b border-slate-200 bg-slate-50">
          <div className="w-full flex items-center justify-between gap-4">
            <span className="text-slate-500 font-medium text-sm">
              Pages / <span className="text-slate-800">{currentPageLabel}</span>
            </span>
            <p className="hidden sm:block text-xs font-semibold text-slate-500 uppercase tracking-[0.2em]">
              AI Tutor
            </p>
          </div>
        </header>

        <main className="px-5 md:px-8 py-6 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

import React from 'react';
import { Outlet } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react';
import Sidebar from './Sidebar';
import OnboardingModal from './OnboardingModal';
import { useAppState } from '../context/AppStateContext';

const Layout = () => {
  const { completeOnboarding, isOnboardingOpen, userName } = useAppState();

  return (
    <div className="min-h-screen bg-background text-primary-text font-sans transition-colors duration-300">
      <Sidebar />
      <OnboardingModal isOpen={isOnboardingOpen} onComplete={completeOnboarding} />

      <div className="ml-20 md:ml-24 min-h-screen">
        <header className="sticky top-0 z-20 px-5 md:px-8 py-4 bg-background/80 backdrop-blur-xl border-b border-primary/10">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-primary-text">Welcome, {userName}</p>
                <p className="text-xs text-secondary-text">Adaptive learning loop is active</p>
              </div>
            </div>
            <p className="hidden sm:block text-xs font-semibold text-secondary-text uppercase tracking-widest">
              AI Tutor Flow
            </p>
          </div>
        </header>

        <main className="p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

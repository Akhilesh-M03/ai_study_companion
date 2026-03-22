import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CircleHelp,
  MessageSquareText,
  FileBarChart2,
  Layers,
  LogOut,
  Sparkles,
  User,
} from 'lucide-react';
import { useAppState } from '../context/AppStateContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { to: '/quiz', label: 'Quiz', icon: <CircleHelp size={20} /> },
  { to: '/chat', label: 'AI Chat', icon: <MessageSquareText size={20} /> },
  { to: '/report', label: 'Report', icon: <FileBarChart2 size={20} /> },
  { to: '/flashcards', label: 'Flashcards', icon: <Layers size={20} /> },
];

const Sidebar = () => {
  const { logout, userName } = useAppState();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="fixed top-0 left-0 z-40 h-screen flex flex-col bg-card/95 backdrop-blur-xl border-r border-primary/10 w-20 hover:w-64 transition-all duration-300 ease-in-out group shadow-2xl overflow-hidden">
      <div className="flex items-center h-20 px-6 border-b border-primary/10 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_15px_var(--color-primary)] shrink-0">
          <Sparkles size={18} className="text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-primary-text ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          AI Tutor
        </h1>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `w-full flex items-center h-11 px-2.5 rounded-xl transition-all duration-200 outline-none ${
                isActive
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'text-secondary-text hover:bg-primary/10 hover:text-primary'
              }`
            }
          >
            <div className="shrink-0 flex items-center justify-center w-7">{item.icon}</div>
            <span className="font-semibold text-sm ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto p-3 border-t border-primary/10 shrink-0 space-y-2">
        <div className="flex items-center h-12 p-1.5 rounded-xl bg-background/50 border border-primary/10 relative overflow-hidden">
          <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shrink-0 z-10">
            <User size={18} />
          </div>
          <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute left-11 whitespace-nowrap">
            <p className="font-bold text-primary-text text-sm">{userName}</p>
            <p className="text-[11px] text-secondary-text">Learner Mode</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center h-11 px-2.5 rounded-xl text-secondary-text hover:bg-primary/10 hover:text-primary transition-all duration-200"
        >
          <div className="shrink-0 flex items-center justify-center w-7">
            <LogOut size={18} />
          </div>
          <span className="font-semibold text-sm ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

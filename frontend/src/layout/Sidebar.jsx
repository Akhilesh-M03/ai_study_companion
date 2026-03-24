import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CircleHelp,
  MessageSquareText,
  BadgeCheck,
  FileBarChart2,
  Layers,
  LogOut,
  Sparkles,
  User,
} from "lucide-react";
import { useAppState } from "../context/AppStateContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { to: "/quiz", label: "Quiz", Icon: CircleHelp },
  { to: "/exam", label: "Exam Mode", Icon: BadgeCheck },
  { to: "/chat", label: "AI Chat", Icon: MessageSquareText },
  { to: "/report", label: "Report", Icon: FileBarChart2 },
  { to: "/flashcards", label: "Flashcards", Icon: Layers },
];

const iconBoxClass =
  "flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0";

const Sidebar = () => {
  const { logout, userName } = useAppState();
  const navigate = useNavigate();
  const userEmail = `${(userName || "learner").replace(/\s+/g, "").toLowerCase()}@aitutor.app`;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="group/sidebar fixed top-0 left-0 z-40 h-screen w-16 md:hover:w-56 bg-white border-r border-slate-200 shadow-sm flex flex-col transition-[width] duration-300">
      <div className="h-20 flex items-center w-full px-3 py-2 border-b border-slate-200 shrink-0">
        <button
          onClick={() => navigate("/dashboard")}
          className={`${iconBoxClass} bg-emerald-50 border border-emerald-100 text-emerald-700`}
          aria-label="Go to dashboard"
        >
          <Sparkles className="w-5 h-5" />
        </button>
        <h1 className="hidden md:block text-xl font-bold tracking-tight text-slate-800 ml-3 whitespace-nowrap max-w-0 opacity-0 overflow-hidden group-hover/sidebar:max-w-35 group-hover/sidebar:opacity-100 transition-all duration-300">
          AI Tutor
        </h1>
      </div>

      <nav className="flex-1 py-6 px-0 space-y-1 overflow-y-auto overflow-x-hidden">
        {navItems.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center w-full px-3 py-2 rounded-xl transition-colors duration-200 ${
                isActive
                  ? "text-emerald-700"
                  : "text-slate-600 hover:text-slate-900"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`${iconBoxClass} ${
                    isActive
                      ? "bg-emerald-50 border border-emerald-100"
                      : "bg-transparent border border-transparent group-hover/sidebar:bg-slate-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="hidden md:block font-semibold text-sm ml-3 whitespace-nowrap max-w-0 opacity-0 overflow-hidden group-hover/sidebar:max-w-35 group-hover/sidebar:opacity-100 transition-all duration-300">
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto px-0 py-3 border-t border-slate-200 shrink-0 space-y-1">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center w-full px-3 py-2 rounded-xl transition-colors duration-200 ${
              isActive
                ? "text-emerald-700"
                : "text-slate-600 hover:text-slate-900"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div
                className={`${iconBoxClass} ${
                  isActive
                    ? "bg-emerald-50 border border-emerald-100"
                    : "bg-slate-50 border border-slate-200"
                }`}
              >
                <User className="w-5 h-5" />
              </div>
              <div className="hidden md:block ml-3 min-w-0 max-w-0 opacity-0 overflow-hidden group-hover/sidebar:max-w-35 group-hover/sidebar:opacity-100 transition-all duration-300">
                <p className="font-semibold text-slate-800 text-sm truncate">
                  {userName || "Learner"}
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  {userEmail}
                </p>
              </div>
            </>
          )}
        </NavLink>

        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 transition-colors duration-200"
        >
          <div
            className={`${iconBoxClass} bg-transparent border border-transparent group-hover/sidebar:bg-slate-50`}
          >
            <LogOut className="w-5 h-5" />
          </div>
          <span className="hidden md:block font-semibold text-sm ml-3 whitespace-nowrap max-w-0 opacity-0 overflow-hidden group-hover/sidebar:max-w-35 group-hover/sidebar:opacity-100 transition-all duration-300">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

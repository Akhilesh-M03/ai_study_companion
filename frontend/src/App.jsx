import React from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AppStateProvider, useAppState } from "./context/AppStateContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Quiz from "./pages/Quiz";
import Layout from "./layout/Layout";
import AIChat from "./pages/AIChat";
import ExamMode from "./pages/ExamMode";
import Profile from "./pages/Profile";
import ReportPage from "./pages/ReportPage";
import Flashcards from "./pages/Flashcards";
import LandingPage from "./pages/LandingPage";
import WorkspaceLoading from "./components/WorkspaceLoading";

const ProtectedRoutes = () => {
  const { userName } = useAppState();

  if (!userName) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

const LoginRoute = () => {
  const { userName } = useAppState();
  if (userName) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Login />;
};

const RegisterRoute = () => {
  const { userName } = useAppState();
  if (userName) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Register />;
};

function App() {
  return (
    <ThemeProvider>
      <AppStateProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/login" element={<LoginRoute />} />
            <Route path="/register" element={<RegisterRoute />} />

            <Route element={<ProtectedRoutes />}>
              <Route path="/workspace-loading" element={<WorkspaceLoading />} />

              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/exam" element={<ExamMode />} />
                <Route path="/chat" element={<AIChat />} />
                <Route path="/report" element={<ReportPage />} />
                <Route path="/flashcards" element={<Flashcards />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AppStateProvider>
    </ThemeProvider>
  );
}

export default App;

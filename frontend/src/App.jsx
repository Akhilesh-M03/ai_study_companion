import React from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AppStateProvider, useAppState } from './context/AppStateContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Quiz from './components/Quiz';
import Layout from './components/Layout';
import Chatbot from './components/Chatbot';
import ReportPage from './components/ReportPage';
import Flashcards from './components/Flashcards';

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
            <Route path="/" element={<LoginRoute />} />
            <Route path="/register" element={<RegisterRoute />} />

            <Route element={<ProtectedRoutes />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/chat" element={<Chatbot />} />
                <Route path="/report" element={<ReportPage />} />
                <Route path="/flashcards" element={<Flashcards />} />
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

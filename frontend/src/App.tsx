import type { ReactElement } from 'react';
import { AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { AnimatedBackground } from './components/AnimatedBackground';
import { Navbar } from './components/Sidebar';
import { useApp } from './context/AppContext';
import { Accounts } from './pages/Accounts';
import { Alerts } from './pages/Alerts';
import { Analysis } from './pages/Analysis';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile';
import { Transactions } from './pages/Transactions';

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center text-white">
    <div className="glass px-8 py-6 rounded-3xl text-sm font-bold uppercase tracking-[0.3em] text-gray-300">
      Cargando
    </div>
  </div>
);

const ProtectedRoute = ({ children }: { children: ReactElement }) => {
  const { isAuthenticated, isLoading } = useApp();

  if (isLoading) {
    return <PageLoader />;
  }

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

const PublicRoute = ({ children }: { children: ReactElement }) => {
  const { isAuthenticated, isLoading } = useApp();

  if (isLoading) {
    return <PageLoader />;
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

const AppContent = () => {
  const location = useLocation();
  const { isAuthenticated } = useApp();
  const showNavbar = location.pathname !== '/' && isAuthenticated;

  return (
    <div className="flex min-h-screen">
      <AnimatedBackground />
      {showNavbar && <Navbar />}

      <main className={`flex-1 transition-all duration-300 ${showNavbar ? 'pl-20 lg:pl-64' : ''}`}>
        <AnimatePresence mode="wait">
          <Routes location={location}>
            <Route
              path="/"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/accounts"
              element={
                <ProtectedRoute>
                  <Accounts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/transactions"
              element={
                <ProtectedRoute>
                  <Transactions />
                </ProtectedRoute>
              }
            />
            <Route path="/budget" element={<Navigate to="/accounts" replace />} />
            <Route
              path="/analysis"
              element={
                <ProtectedRoute>
                  <Analysis />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alerts"
              element={
                <ProtectedRoute>
                  <Alerts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/'} replace />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

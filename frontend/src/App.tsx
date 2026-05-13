import { BrowserRouter as Router, Navigate, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { Accounts } from './pages/Accounts';
import { Analysis } from './pages/Analysis';
import { Alerts } from './pages/Alerts';
import { Profile } from './pages/Profile';
import { Navbar } from './components/Sidebar';
import { AnimatedBackground } from './components/AnimatedBackground';

const AppContent = () => {
  const location = useLocation();
  const showNavbar = location.pathname !== '/';

  return (
    <div className="flex min-h-screen">
      <AnimatedBackground />
      {showNavbar && <Navbar />}
      
      <main className={`flex-1 transition-all duration-300 ${showNavbar ? 'pl-20 lg:pl-64' : ''}`}>
        <AnimatePresence mode="wait">
          <Routes location={location}>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/budget" element={<Navigate to="/accounts" replace />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
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

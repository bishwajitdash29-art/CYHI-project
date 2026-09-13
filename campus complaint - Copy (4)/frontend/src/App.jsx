import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';

// If the user clicked "No" for "Stay Logged In", wipe the session ONLY on a manual hard refresh (F5/Reload)
const navEntries = window.performance.getEntriesByType("navigation");
if (navEntries.length > 0 && navEntries[0].type === "reload") {
  if (sessionStorage.getItem('temporary') === 'true') {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('temporary');
  }
}

import SubmitComplaint from './pages/SubmitComplaint';
import TrackComplaint from './pages/TrackComplaint';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import PublicComplaints from './pages/PublicComplaints';
import CommitteeDashboard from './pages/CommitteeDashboard';
import Profile from './pages/Profile';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setUser(res.data))
      .catch(err => console.error(err));
    }
  }, []);
  
  return (
    <Router>
      <div className="min-h-screen transition-colors duration-200 bg-gray-50 dark:bg-[#08090a] flex flex-col text-gray-900 dark:text-gray-200 font-sans">
        <header className="bg-white/80 dark:bg-[#08090a]/80 backdrop-blur-md shadow-sm py-4 px-6 mb-8 sticky top-0 z-50 border-b border-gray-200 dark:border-white/[0.08] transition-colors">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></span>
              Campus Feedback
            </h1>
            <nav className="flex gap-6 items-center text-sm">
              <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-gray-500 dark:text-gray-400">
                {darkMode ? <Sun size={18} className="text-gray-300"/> : <Moon size={18} />}
              </button>
              
              <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors">Overview</Link>
              
              {!(localStorage.getItem('token') || sessionStorage.getItem('token')) ? (
                <>
                  <Link to="/login" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors ml-2">Student Login</Link>
                  <Link to="/login" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors">Staff Login</Link>
                  <Link to="/register" className="linear-primary-button px-4 py-2 text-sm font-medium">Register</Link>
                </>
              ) : (
                <>
                  <Link to="/public-complaints" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium border-l border-gray-200 dark:border-white/10 pl-6 ml-2 transition-colors">Wall</Link>
                  <Link to="/profile" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors ml-2">Profile</Link>
                  <Link to={(localStorage.getItem('role') || sessionStorage.getItem('role')) === 'COMMITTEE' ? '/dashboard/committee' : '/dashboard/user'} className="text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-500 transition-colors">Dashboard</Link>
                  <button onClick={() => { localStorage.clear(); sessionStorage.clear(); window.location.href = '/'; }} className="text-red-500 hover:text-red-600 dark:text-red-400/80 dark:hover:text-red-400 font-medium transition-colors">Logout</button>
                </>
              )}
            </nav>
          </div>
        </header>
        
        <main className="flex-1 max-w-5xl w-full mx-auto px-6 pb-16">
          <Routes>
            <Route path="/" element={
              <div className="flex flex-col gap-24 mt-16">
                
                {/* Hero / Overview Section */}
                <section className="text-center space-y-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-xs font-medium text-gray-600 dark:text-gray-300 mb-4 backdrop-blur-sm">
                    <span className="flex h-2 w-2 rounded-full bg-indigo-500"></span>
                    Now with End-to-End Anonymity
                  </div>
                  <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Campus Grievance & <br className="hidden md:block"/>
                    <span className="linear-gradient-text">Feedback Portal</span>
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                    A secure, transparent, and completely anonymous platform designed to maintain a healthy academic environment. 
                    Submit your grievances against professors or peers without fear, and let the Feedback Management Committee ensure your voice is heard.
                  </p>
                  
                  <div className="flex justify-center gap-4 pt-8">
                    <Link to="/submit" className="linear-primary-button px-6 py-3 text-sm">
                      Submit Anonymous Complaint
                    </Link>
                    <Link to="/track" className="linear-button px-6 py-3 text-sm">
                      Track Existing Complaint
                    </Link>
                  </div>
                </section>

                {/* Features Section */}
                <section className="grid md:grid-cols-3 gap-8 text-center">
                  <div className="linear-card p-8">
                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center mx-auto mb-6 text-xl font-bold shadow-sm dark:shadow-[0_0_15px_rgba(99,102,241,0.15)]">1</div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">100% Anonymous</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">Your identity is never revealed to the accused. Submit feedback freely and safely.</p>
                  </div>
                  <div className="linear-card p-8">
                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center mx-auto mb-6 text-xl font-bold shadow-sm dark:shadow-[0_0_15px_rgba(99,102,241,0.15)]">2</div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Real-time Tracking</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">Use your unique tracking token to see replies and status updates at any time.</p>
                  </div>
                  <div className="linear-card p-8">
                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center mx-auto mb-6 text-xl font-bold shadow-sm dark:shadow-[0_0_15px_rgba(99,102,241,0.15)]">3</div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Committee Oversight</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">All interactions are monitored by the administration to ensure swift resolution.</p>
                  </div>
                </section>

              </div>
            } />
            <Route path="/submit" element={<SubmitComplaint />} />
            <Route path="/track" element={<TrackComplaint />} />
            <Route path="/public-complaints" element={<ProtectedRoute><PublicComplaints /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/dashboard/user" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/committee" element={<CommitteeDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

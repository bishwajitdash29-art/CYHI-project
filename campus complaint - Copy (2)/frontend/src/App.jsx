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
      <div className="min-h-screen transition-colors duration-200 bg-gray-50 dark:bg-gray-900 flex flex-col text-gray-900 dark:text-gray-100">
        <header className="bg-white dark:bg-gray-800 shadow-sm py-4 px-6 mb-8 sticky top-0 z-50 border-b border-transparent dark:border-gray-700 transition-colors">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Campus Feedback</h1>
            <nav className="flex gap-6 items-center">
              <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                {darkMode ? <Sun size={20} className="text-yellow-400"/> : <Moon size={20} className="text-gray-600"/>}
              </button>
              
              <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Overview</Link>
              {!(localStorage.getItem('token') || sessionStorage.getItem('token')) ? (
                <>
                  <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Student Login</Link>
                  <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Staff Login</Link>
                  <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 shadow-sm transition">Register</Link>
                </>
              ) : (
                <>
                  <Link to="/profile" className="text-gray-800 dark:text-gray-200 font-bold hover:text-blue-600 dark:hover:text-blue-400 transition">My Profile</Link>
                  <Link to={(localStorage.getItem('role') || sessionStorage.getItem('role')) === 'COMMITTEE' ? '/dashboard/committee' : '/dashboard/user'} className="text-blue-600 dark:text-blue-400 font-medium hover:underline">Dashboard</Link>
                  <button onClick={() => { localStorage.clear(); sessionStorage.clear(); window.location.href = '/'; }} className="text-red-600 dark:text-red-400 font-medium hover:underline">Logout</button>
                </>
              )}
            </nav>
          </div>
        </header>
        
        <main className="flex-1 max-w-5xl w-full mx-auto px-6 pb-16">
          <Routes>
            <Route path="/" element={
              <div className="flex flex-col gap-24 mt-8">
                
                {/* Hero / Overview Section */}
                <section className="text-center space-y-6">
                  <h2 className="text-5xl font-extrabold tracking-tight">Campus Grievance & Feedback Portal</h2>
                  <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                    A secure, transparent, and completely anonymous platform designed to maintain a healthy academic environment. 
                    Submit your grievances against professors or peers without fear, and let the Feedback Management Committee ensure your voice is heard.
                  </p>
                  
                  <div className="flex justify-center gap-4 pt-6">
                    {(localStorage.getItem('token') || sessionStorage.getItem('token')) ? (
                      <>
                        <Link to="/submit" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-700 shadow-lg transition transform hover:-translate-y-0.5">
                          Submit Anonymous Complaint
                        </Link>
                        <Link to="/track" className="bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-2 border-blue-600 dark:border-blue-500 px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-50 dark:hover:bg-gray-700 shadow-sm transition">
                          Track Existing Complaint
                        </Link>
                      </>
                    ) : (
                      <p className="text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-gray-800 px-6 py-4 rounded-lg border border-blue-100 dark:border-gray-700">
                        Please log in to submit or track complaints.
                      </p>
                    )}
                  </div>
                </section>

                {/* Features Section */}
                <section className="grid md:grid-cols-3 gap-8 text-center">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
                    <h3 className="text-xl font-bold mb-2">100% Anonymous</h3>
                    <p className="text-gray-600 dark:text-gray-400">Your identity is never revealed to the accused. Submit feedback freely and safely.</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
                    <h3 className="text-xl font-bold mb-2">Real-time Tracking</h3>
                    <p className="text-gray-600 dark:text-gray-400">Use your unique tracking token to see replies and status updates at any time.</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
                    <h3 className="text-xl font-bold mb-2">Committee Oversight</h3>
                    <p className="text-gray-600 dark:text-gray-400">All interactions are monitored by the administration to ensure swift resolution.</p>
                  </div>
                </section>

                {/* Logins Section at the Bottom */}
                <section className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 text-center">
                  <h3 className="text-3xl font-bold mb-4">Access Your Dashboard</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                    Are you a registered student, professor, or committee member? Log in below to manage complaints assigned to you or oversee the system.
                  </p>
                  <div className="flex flex-col md:flex-row justify-center gap-6">
                    <div className="flex-1 bg-blue-50 dark:bg-gray-700 p-8 rounded-xl border border-blue-100 dark:border-gray-600">
                      <h4 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-2">Student Portal</h4>
                      <p className="text-blue-700 dark:text-blue-300 mb-6 text-sm">Log in to view complaints directed at you, or manage your profile using your Roll No / Institute Email.</p>
                      <Link to="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 w-full block shadow transition">Student Login</Link>
                    </div>
                    
                    <div className="flex-1 bg-gray-50 dark:bg-gray-700 p-8 rounded-xl border border-gray-200 dark:border-gray-600">
                      <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Staff Portal</h4>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">For Professors and Feedback Management Committee members to review and reply to grievances.</p>
                      <Link to="/login" className="bg-gray-800 dark:bg-gray-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-700 w-full block shadow transition">Staff Login</Link>
                    </div>
                  </div>
                </section>

              </div>
            } />
            <Route path="/submit" element={<ProtectedRoute><SubmitComplaint /></ProtectedRoute>} />
            <Route path="/track" element={<ProtectedRoute><TrackComplaint /></ProtectedRoute>} />
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

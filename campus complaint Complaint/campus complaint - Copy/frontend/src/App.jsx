import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Moon, Sun, AlertCircle, Lightbulb, Menu, X, Home, MessageSquare, FileText, User, LogOut, Vote } from 'lucide-react';

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
import PublicComplaints from './pages/PublicComplaints';
import Proposals from './pages/Proposals';
import SenateElections from './pages/SenateElections';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import UserDashboard from './pages/UserDashboard';
import CommitteeDashboard from './pages/CommitteeDashboard';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const BackgroundImage = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
    <div 
      className="absolute inset-0 bg-[url('/campus-bg-light.png')] dark:bg-[url('/campus-bg-dark.png')] bg-cover bg-center bg-no-repeat opacity-[0.35] dark:opacity-[0.25] mix-blend-luminosity scale-[1.02] transition-opacity duration-700"
      style={{ filter: 'grayscale(80%) contrast(1.1)' }}
    />
    <div className="absolute inset-0 bg-indigo-500/20 dark:bg-indigo-500/10 mix-blend-color transition-colors duration-700" />
    <div className="absolute inset-0 bg-gradient-to-b from-gray-50/10 via-gray-50/80 to-gray-50 dark:from-[#08090a]/10 dark:via-[#08090a]/80 dark:to-[#08090a] transition-colors duration-700" />
  </div>
);

const WaveBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
    {/* Layer 1 - Slowest, Tallest */}
    <div className="absolute bottom-0 left-0 w-[200%] h-[250px] md:h-[300px] opacity-[0.02] dark:opacity-[0.015]">
      <svg viewBox="0 0 2000 100" preserveAspectRatio="none" className="w-full h-full text-indigo-500 fill-current animate-[wave-infinite_20s_linear_infinite]">
        <path d="M0,50 Q250,100 500,50 T1000,50 Q1250,100 1500,50 T2000,50 L2000,100 L0,100 Z" />
      </svg>
    </div>
    {/* Layer 2 - Medium Slow, Reverse */}
    <div className="absolute bottom-0 left-0 w-[200%] h-[200px] md:h-[240px] opacity-[0.03] dark:opacity-[0.02]">
      <svg viewBox="0 0 2000 100" preserveAspectRatio="none" className="w-full h-full text-indigo-500 fill-current animate-[wave-infinite-reverse_15s_linear_infinite]">
        <path d="M0,50 Q250,100 500,50 T1000,50 Q1250,100 1500,50 T2000,50 L2000,100 L0,100 Z" />
      </svg>
    </div>
    {/* Layer 3 - Medium Fast */}
    <div className="absolute bottom-0 left-0 w-[200%] h-[150px] md:h-[180px] opacity-[0.04] dark:opacity-[0.03]">
      <svg viewBox="0 0 2000 100" preserveAspectRatio="none" className="w-full h-full text-indigo-500 fill-current animate-[wave-infinite_10s_linear_infinite]">
        <path d="M0,50 Q250,100 500,50 T1000,50 Q1250,100 1500,50 T2000,50 L2000,100 L0,100 Z" />
      </svg>
    </div>
    {/* Layer 4 - Fastest, Shortest */}
    <div className="absolute bottom-0 left-0 w-[200%] h-[100px] md:h-[120px] opacity-[0.05] dark:opacity-[0.04]">
      <svg viewBox="0 0 2000 100" preserveAspectRatio="none" className="w-full h-full text-indigo-500 fill-current animate-[wave-infinite-reverse_7s_linear_infinite]">
        <path d="M0,50 Q250,100 500,50 T1000,50 Q1250,100 1500,50 T2000,50 L2000,100 L0,100 Z" />
      </svg>
    </div>
  </div>
);

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    if (user && user.username === 'director@iiitdmj.ac.in') {
      document.documentElement.setAttribute('data-theme', 'director');
    } else {
      const role = localStorage.getItem('role') || sessionStorage.getItem('role');
      if (role === 'STUDENT') {
        document.documentElement.setAttribute('data-theme', 'student');
      } else if (role) {
        document.documentElement.setAttribute('data-theme', 'staff');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    }
  }, [user]);

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      axios.get(API_URL + '/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setUser(res.data))
      .catch(err => console.error(err));
    }
  }, []);
  
  return (
    <Router>
      <div className="min-h-screen transition-colors duration-200 bg-gray-50 dark:bg-[#08090a] flex flex-col text-gray-900 dark:text-gray-200 font-sans relative">
        <BackgroundImage />
        <WaveBackground />
        <header className="bg-white/80 dark:bg-[#08090a]/80 backdrop-blur-md shadow-sm py-4 px-6 mb-8 sticky top-0 z-40 border-b border-gray-200 dark:border-white/[0.08] transition-colors">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300 transition-colors focus:outline-none"
              >
                <Menu size={24} />
              </button>
              <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-indigo-500 shadow-[0_0_10px_color-mix(in_srgb,var(--color-indigo-500)_50%,transparent)]"></span>
                SpeakUp Campus
              </h1>
            </div>
            <nav className="flex gap-4 md:gap-6 items-center text-sm">
              <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-gray-500 dark:text-gray-400">
                {darkMode ? <Sun size={18} className="text-gray-300"/> : <Moon size={18} />}
              </button>
              
              {!(localStorage.getItem('token') || sessionStorage.getItem('token')) ? (
                <div className="hidden md:flex items-center gap-4">
                  <Link to="/login" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors">Login</Link>
                  <Link to="/register" className="linear-primary-button px-4 py-2 text-sm font-medium">Register</Link>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link to={(localStorage.getItem('role') || sessionStorage.getItem('role')) === 'COMMITTEE' ? '/dashboard/committee' : '/dashboard/user'} className="hidden md:block text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-500 transition-colors">Dashboard</Link>
                  <button onClick={() => { localStorage.clear(); sessionStorage.clear(); window.location.href = '/'; }} className="text-red-500 hover:text-red-600 dark:text-red-400/80 dark:hover:text-red-400 font-medium transition-colors">Logout</button>
                </div>
              )}
            </nav>
          </div>
        </header>

        {/* Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar Drawer */}
        <div className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-[#0a0a0c] border-r border-gray-200 dark:border-white/10 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                Menu
              </h2>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 space-y-2">
              <Link to="/" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors font-medium">
                <Home size={18} className="text-gray-400" />
                Overview / Home
              </Link>
              
              <div className="pt-4 pb-2">
                <p className="px-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Modules</p>
              </div>
              
              <Link to="/submit" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors font-medium">
                <AlertCircle size={18} className="text-red-400" />
                Campus Complaint
              </Link>
              
              <Link to="/proposals" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-500/10 hover:text-green-600 dark:hover:text-green-400 rounded-lg transition-colors font-medium">
                <Lightbulb size={20} />
                Campus Proposals
              </Link>
              <Link to="/elections" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-colors font-medium">
                <Vote size={20} />
                Senate Elections
              </Link>
              <Link to="/public-complaints" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors font-medium">
                <MessageSquare size={18} className="text-gray-400" />
                Public Wall
              </Link>

              {(localStorage.getItem('token') || sessionStorage.getItem('token')) && (
                <>
                  <div className="pt-6 pb-2">
                    <p className="px-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Account</p>
                  </div>
                  <Link to={(localStorage.getItem('role') || sessionStorage.getItem('role')) === 'COMMITTEE' ? '/dashboard/committee' : '/dashboard/user'} onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors font-medium">
                    <FileText size={18} className="text-gray-400" />
                    Dashboard
                  </Link>
                  <Link to="/profile" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors font-medium">
                    <User size={18} className="text-gray-400" />
                    Profile
                  </Link>
                  <button onClick={() => { localStorage.clear(); sessionStorage.clear(); window.location.href = '/'; }} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors font-medium">
                    <LogOut size={18} className="text-red-400" />
                    Logout
                  </button>
                </>
              )}
            </nav>
            
            <div className="pt-6 mt-auto border-t border-gray-200 dark:border-white/10">
              <p className="text-xs text-center text-gray-400 dark:text-gray-500">
                SpeakUp Campus v2.0
              </p>
            </div>
          </div>
        </div>
        
        <main className="flex-1 max-w-5xl w-full mx-auto px-6 pb-16 relative z-10">
          <Routes>
            <Route path="/" element={
              <div className="mt-8">
                {!(localStorage.getItem('token') || sessionStorage.getItem('token')) ? (
                  // Logged out: Split layout (Instagram style)
                  <div className="flex flex-col md:flex-row items-center justify-center min-h-[75vh] w-full max-w-4xl mx-auto gap-8">
                    {/* Left Side */}
                    <div className="hidden md:flex flex-1 flex-col justify-center items-end pr-8 relative">
                      <div className="max-w-[380px] w-full mt-10">
                        <h2 className="text-[28px] font-semibold leading-tight text-gray-900 dark:text-white mb-8">
                          See everyday issues and ideas from your <br/>
                          <span className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent font-medium">campus peers.</span>
                        </h2>
                        
                        {/* Mockup area - overlapping cards */}
                        <div className="relative w-full h-[320px]">
                          {/* Top Card (Complaint) */}
                          <div className="absolute top-0 right-8 w-64 bg-white dark:bg-[#1a1a1a] p-4 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 z-20 transform rotate-3">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                <AlertCircle size={14} className="text-red-500" />
                              </div>
                              <div className="flex-1">
                                <div className="h-2 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                                <div className="h-1.5 w-12 bg-gray-100 dark:bg-gray-800 rounded"></div>
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded"></div>
                              <div className="h-2 w-5/6 bg-gray-100 dark:bg-gray-800 rounded"></div>
                              <div className="h-2 w-4/6 bg-gray-100 dark:bg-gray-800 rounded"></div>
                            </div>
                          </div>
                          
                          {/* Bottom Card (Proposal) */}
                          <div className="absolute bottom-10 left-0 w-64 bg-white dark:bg-[#1a1a1a] p-4 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 z-10 transform -rotate-3">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <Lightbulb size={14} className="text-green-500" />
                              </div>
                              <div className="flex-1">
                                <div className="h-2 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                                <div className="h-1.5 w-16 bg-gray-100 dark:bg-gray-800 rounded"></div>
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded"></div>
                              <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded"></div>
                              <div className="h-2 w-3/6 bg-gray-100 dark:bg-gray-800 rounded"></div>
                            </div>
                            <div className="mt-3 flex gap-2">
                               <div className="h-6 w-12 bg-gray-100 dark:bg-gray-800 rounded-full"></div>
                            </div>
                          </div>
                          
                          {/* Floating Emoji/Icon elements */}
                          <div className="absolute top-10 left-10 w-10 h-10 bg-white dark:bg-black rounded-full shadow-lg flex items-center justify-center z-30 border border-gray-100 dark:border-gray-800 text-lg">
                            🔥
                          </div>
                          <div className="absolute bottom-6 right-6 w-10 h-10 bg-white dark:bg-black rounded-full shadow-lg flex items-center justify-center z-30 border border-gray-100 dark:border-gray-800 text-lg">
                            💡
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right Side - Login Form */}
                    <div className="flex-1 w-full flex justify-center md:justify-start z-20">
                      <Login />
                    </div>
                  </div>
                ) : (
                  // Logged in: Options portal
                  <div className="text-center space-y-12 mt-10">
                    <div>
                      <h2 className="text-4xl md:text-5xl font-extrabold dark:text-white text-gray-900 tracking-tighter">
                        Welcome to <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">SpeakUp</span> Campus
                      </h2>
                      <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 mt-4 max-w-2xl mx-auto font-medium">Select a portal to continue.</p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto text-left">
                      {/* Option 1 */}
                      <div className="group relative p-8 md:p-10 bg-white/70 dark:bg-[#1a1a1a]/60 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)] border border-white/50 dark:border-white/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_-12px_rgba(239,68,68,0.15)] flex flex-col h-full overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl -mr-20 -mt-20 transition-opacity opacity-50 group-hover:opacity-100"></div>
                        
                        <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 text-white rounded-[1.25rem] flex items-center justify-center mb-8 shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform duration-300">
                          <AlertCircle size={32} />
                        </div>
                        <h3 className="relative z-10 text-2xl md:text-3xl font-bold dark:text-white text-gray-900 mb-4 tracking-tight">Campus Issue Complaint</h3>
                        <p className="relative z-10 text-gray-600 dark:text-gray-400 mb-10 flex-1 leading-relaxed font-medium">Report an issue anonymously to the administration. Track resolution in real-time securely with your zero-knowledge tracking token.</p>
                        <Link to="/submit" className="relative z-10 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 dark:text-black text-white font-semibold py-4 px-8 rounded-2xl shadow-xl transition-all w-full text-center hover:scale-[1.02]">
                          File a Complaint
                        </Link>
                      </div>

                      {/* Option 2 */}
                      <div className="group relative p-8 md:p-10 bg-white/70 dark:bg-[#1a1a1a]/60 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)] border border-white/50 dark:border-white/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_-12px_rgba(34,197,94,0.15)] flex flex-col h-full overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl -mr-20 -mt-20 transition-opacity opacity-50 group-hover:opacity-100"></div>
                        
                        <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-600 text-white rounded-[1.25rem] flex items-center justify-center mb-8 shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform duration-300">
                          <Lightbulb size={32} />
                        </div>
                        <h3 className="relative z-10 text-2xl md:text-3xl font-bold dark:text-white text-gray-900 mb-4 tracking-tight">Campus Proposition</h3>
                        <p className="relative z-10 text-gray-600 dark:text-gray-400 mb-10 flex-1 leading-relaxed font-medium">Suggest a new idea, upvote others, and help build a better campus together. Voted ideas get officially reviewed by departments.</p>
                        <Link to="/proposals" className="relative z-10 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 dark:text-black text-white font-semibold py-4 px-8 rounded-2xl shadow-xl transition-all w-full text-center hover:scale-[1.02]">
                          Go to Proposals Board
                        </Link>
                      </div>

                      {/* Option 3 */}
                      <div className="group relative p-8 md:p-10 bg-white/70 dark:bg-[#1a1a1a]/60 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)] border border-white/50 dark:border-white/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_-12px_rgba(99,102,241,0.15)] flex flex-col h-full overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 transition-opacity opacity-50 group-hover:opacity-100"></div>
                        
                        <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-indigo-400 to-indigo-600 text-white rounded-[1.25rem] flex items-center justify-center mb-8 shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
                          <Vote size={32} />
                        </div>
                        <h3 className="relative z-10 text-2xl md:text-3xl font-bold dark:text-white text-gray-900 mb-4 tracking-tight">Senate Election</h3>
                        <p className="relative z-10 text-gray-600 dark:text-gray-400 mb-10 flex-1 leading-relaxed font-medium">Cast your anonymous vote for the student senate using zero-knowledge cryptographic proofs. Eligible students only.</p>
                        <Link to="/elections" className="relative z-10 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 dark:text-black text-white font-semibold py-4 px-8 rounded-2xl shadow-xl transition-all w-full text-center hover:scale-[1.02]">
                          Voting Portal
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            } />
            <Route path="/proposals" element={<Proposals />} />
            <Route path="/elections" element={<ProtectedRoute><SenateElections /></ProtectedRoute>} />
            <Route path="/submit" element={<ProtectedRoute><SubmitComplaint /></ProtectedRoute>} />
            <Route path="/track" element={<ProtectedRoute><TrackComplaint /></ProtectedRoute>} />
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

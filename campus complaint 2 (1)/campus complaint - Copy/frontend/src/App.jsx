import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

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

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white shadow-sm py-4 px-6 mb-8 sticky top-0 z-50">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">Campus Feedback</h1>
            <nav className="flex gap-6 items-center">
              <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium">Overview</Link>
              {!(localStorage.getItem('token') || sessionStorage.getItem('token')) ? (
                <>
                  <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium">Student Login</Link>
                  <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium">Staff Login</Link>
                  <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 shadow-sm transition">Register</Link>
                </>
              ) : (
                <>
                  <Link to={(localStorage.getItem('role') || sessionStorage.getItem('role')) === 'COMMITTEE' ? '/dashboard/committee' : '/dashboard/user'} className="text-blue-600 font-medium hover:underline">Dashboard</Link>
                  <button onClick={() => { localStorage.clear(); sessionStorage.clear(); window.location.href = '/'; }} className="text-red-600 font-medium hover:underline">Logout</button>
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
                  <h2 className="text-5xl font-extrabold text-gray-900 tracking-tight">Campus Grievance & Feedback Portal</h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    A secure, transparent, and completely anonymous platform designed to maintain a healthy academic environment. 
                    Submit your grievances against professors or peers without fear, and let the Feedback Management Committee ensure your voice is heard.
                  </p>
                  
                  <div className="flex justify-center gap-4 pt-6">
                    {(localStorage.getItem('token') || sessionStorage.getItem('token')) ? (
                      <>
                        <Link to="/submit" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-700 shadow-lg transition transform hover:-translate-y-0.5">
                          Submit Anonymous Complaint
                        </Link>
                        <Link to="/track" className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-50 shadow-sm transition">
                          Track Existing Complaint
                        </Link>
                      </>
                    ) : (
                      <p className="text-blue-600 font-semibold bg-blue-50 px-6 py-4 rounded-lg border border-blue-100">
                        Please log in to submit or track complaints.
                      </p>
                    )}
                  </div>
                </section>

                {/* Features Section */}
                <section className="grid md:grid-cols-3 gap-8 text-center">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
                    <h3 className="text-xl font-bold mb-2">100% Anonymous</h3>
                    <p className="text-gray-600">Your identity is never revealed to the accused. Submit feedback freely and safely.</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
                    <h3 className="text-xl font-bold mb-2">Real-time Tracking</h3>
                    <p className="text-gray-600">Use your unique tracking token to see replies and status updates at any time.</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
                    <h3 className="text-xl font-bold mb-2">Committee Oversight</h3>
                    <p className="text-gray-600">All interactions are monitored by the administration to ensure swift resolution.</p>
                  </div>
                </section>

                {/* Logins Section at the Bottom */}
                <section className="bg-white p-10 rounded-2xl shadow-md border border-gray-200 text-center">
                  <h3 className="text-3xl font-bold mb-4">Access Your Dashboard</h3>
                  <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                    Are you a registered student, professor, or committee member? Log in below to manage complaints assigned to you or oversee the system.
                  </p>
                  <div className="flex flex-col md:flex-row justify-center gap-6">
                    <div className="flex-1 bg-blue-50 p-8 rounded-xl border border-blue-100">
                      <h4 className="text-2xl font-bold text-blue-900 mb-2">Student Portal</h4>
                      <p className="text-blue-700 mb-6 text-sm">Log in to view complaints directed at you, or manage your profile using your Roll No / Institute Email.</p>
                      <Link to="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 w-full block shadow transition">Student Login</Link>
                    </div>
                    
                    <div className="flex-1 bg-gray-50 p-8 rounded-xl border border-gray-200">
                      <h4 className="text-2xl font-bold text-gray-900 mb-2">Staff Portal</h4>
                      <p className="text-gray-600 mb-6 text-sm">For Professors and Feedback Management Committee members to review and reply to grievances.</p>
                      <Link to="/login" className="bg-gray-800 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-900 w-full block shadow transition">Staff Login</Link>
                    </div>
                  </div>
                </section>

              </div>
            } />
            <Route path="/submit" element={<ProtectedRoute><SubmitComplaint /></ProtectedRoute>} />
            <Route path="/track" element={<ProtectedRoute><TrackComplaint /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard/user" element={<UserDashboard />} />
            <Route path="/dashboard/committee" element={<CommitteeDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

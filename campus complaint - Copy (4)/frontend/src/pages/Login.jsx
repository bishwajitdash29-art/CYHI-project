import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // State for the post-login prompt
  const [showPrompt, setShowPrompt] = useState(false);
  const [tempAuth, setTempAuth] = useState(null);
  
  const navigate = useNavigate();
  
  // Read role from query param to set initial tab
  const params = new URLSearchParams(window.location.search);
  const [isStaff, setIsStaff] = useState(params.get('role') === 'staff');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      // Hold the auth data in memory and show prompt
      setTempAuth({ token: res.data.token, role: res.data.role });
      setShowPrompt(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const finalizeLogin = (stayLoggedIn) => {
    if (stayLoggedIn) {
      localStorage.setItem('token', tempAuth.token);
      localStorage.setItem('role', tempAuth.role);
    } else {
      sessionStorage.setItem('token', tempAuth.token);
      sessionStorage.setItem('role', tempAuth.role);
      sessionStorage.setItem('temporary', 'true');
    }
    
    // Redirect based on role with a full page refresh
    if (tempAuth.role === 'STUDENT') {
      window.location.href = '/';
    } else if (tempAuth.role === 'COMMITTEE') {
      window.location.href = '/dashboard/committee';
    } else {
      window.location.href = '/dashboard/user'; // Generic Staff Dashboard
    }
  };

  if (showPrompt) {
    return (
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 border dark:border-gray-700 rounded-lg shadow-sm mt-10 text-center">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Login Successful!</h2>
        <p className="mb-6 text-gray-700 dark:text-gray-300">Do you wish to stay logged in on this device?</p>
        <div className="flex gap-4 justify-center">
          <button 
            onClick={() => finalizeLogin(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700"
          >
            Yes
          </button>
          <button 
            onClick={() => finalizeLogin(false)}
            className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-2 rounded font-medium hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            No
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto linear-card p-10 mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">Welcome Back</h2>
      
      {error && <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-3 rounded mb-4 text-sm border border-red-200 dark:border-red-800/50">{error}</div>}
      
      <div className="flex justify-center mb-8 bg-gray-100 dark:bg-black/40 p-1 rounded-lg">
        <button 
          type="button"
          className={`flex-1 py-2 font-semibold text-sm rounded-md transition-all ${!isStaff ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
          onClick={() => setIsStaff(false)}
        >
          Student
        </button>
        <button 
          type="button"
          className={`flex-1 py-2 font-semibold text-sm rounded-md transition-all ${isStaff ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
          onClick={() => setIsStaff(true)}
        >
          Staff
        </button>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {isStaff ? 'Username / Email' : 'Institute Email ID'}
          </label>
          <input 
            type="text" 
            required 
            className="linear-input" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={isStaff ? 'e.g. director@iiitdmj.ac.in' : 'e.g. 25bcs092@iiitdmj.ac.in'}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
          <input 
            type="password" 
            required 
            className="linear-input" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="linear-primary-button w-full py-3 mt-4 disabled:opacity-50"
        >
          {loading ? 'Authenticating...' : 'Log In'}
        </button>
      </form>
      
      {!isStaff && (
        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Don't have an account? <Link to="/register" className="text-indigo-600 dark:text-indigo-400 hover:underline">Sign up</Link>
          </p>
        </div>
      )}
    </div>
  );
}

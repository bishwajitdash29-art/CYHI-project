import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
      const res = await axios.post(API_URL + '/api/auth/login', { username, password });
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
    <div className="w-full max-w-sm mx-auto linear-card p-8">
      <h2 className="text-2xl md:text-3xl font-extrabold mb-8 text-center linear-gradient-text">Log into SpeakUp</h2>
      
      {error && <div className="text-red-600 text-center mb-4 text-sm font-bold bg-red-100 p-2 rounded-xl">{error}</div>}
      
      <div className="flex justify-center mb-8 bg-[#f0f0f3] dark:bg-[#1a1b1e] p-1.5 rounded-full shadow-[inset_4px_4px_8px_#d1d5df,inset_-4px_-4px_8px_#ffffff] dark:shadow-[inset_4px_4px_8px_#111113,inset_-4px_-4px_8px_#232529]">
        <button 
          type="button"
          className={`flex-1 py-2 font-bold text-sm rounded-full transition-all ${!isStaff ? 'bg-gradient-to-r from-[#c084fc] to-[#a855f7] text-white shadow-[4px_4px_8px_#d1d5df,-4px_-4px_8px_#ffffff] dark:shadow-[2px_2px_4px_#111113,-2px_-2px_4px_#232529]' : 'text-gray-500 dark:text-gray-400 hover:text-purple-500'}`}
          onClick={() => setIsStaff(false)}
        >
          Student
        </button>
        <button 
          type="button"
          className={`flex-1 py-2 font-bold text-sm rounded-full transition-all ${isStaff ? 'bg-gradient-to-r from-[#c084fc] to-[#a855f7] text-white shadow-[4px_4px_8px_#d1d5df,-4px_-4px_8px_#ffffff] dark:shadow-[2px_2px_4px_#111113,-2px_-2px_4px_#232529]' : 'text-gray-500 dark:text-gray-400 hover:text-purple-500'}`}
          onClick={() => setIsStaff(true)}
        >
          Staff
        </button>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <input 
            type="text" 
            required 
            className="linear-input" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={isStaff ? 'Institute Email (e.g. director@)' : 'Institute Email (e.g. 25bcs092@)'}
          />
        </div>
        
        <div>
          <input 
            type="password" 
            required 
            className="linear-input" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="linear-primary-button w-full mt-2"
        >
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <a href="#" className="text-sm text-purple-600 dark:text-purple-400 font-bold hover:underline">Forgot password?</a>
      </div>
      
      {!isStaff && (
        <div className="mt-8">
          <div className="relative flex items-center justify-center my-6">
            <div className="absolute w-full border-t border-gray-200 dark:border-gray-800"></div>
            <div className="relative bg-[#f0f0f3] dark:bg-[#1a1b1e] px-4 text-xs font-bold text-gray-400 tracking-widest uppercase">OR</div>
          </div>
          
          <Link to="/register" className="linear-button w-full block text-center">
            Create new account
          </Link>
        </div>
      )}
    </div>
  );
}

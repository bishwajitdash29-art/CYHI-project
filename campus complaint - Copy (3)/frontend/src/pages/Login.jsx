import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  
  // State for the post-login prompt
  const [showPrompt, setShowPrompt] = useState(false);
  const [tempAuth, setTempAuth] = useState(null);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      // Hold the auth data in memory and show prompt
      setTempAuth({ token: res.data.token, role: res.data.role });
      setShowPrompt(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
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
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 border dark:border-gray-700 rounded-lg shadow-sm mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">Login</h2>
      {error && <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-3 rounded mb-4">{error}</div>}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block font-medium mb-1 dark:text-gray-200">Email ID / Username</label>
          <input 
            type="text" 
            className="w-full border dark:border-gray-600 p-2 rounded focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1 dark:text-gray-200">Password</label>
          <input 
            type="password" 
            className="w-full border dark:border-gray-600 p-2 rounded focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
      <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        Don't have an account? <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:underline">Register here</Link>
      </div>
    </div>
  );
}

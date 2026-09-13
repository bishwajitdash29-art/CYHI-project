import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Register() {
  const [isStudent, setIsStudent] = useState(true);
  const [role, setRole] = useState('PROFESSOR');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      let finalName = name;
      if (isStudent) {
        finalName = "Student"; // Default name for students to remain anonymous
      }

      await axios.post(API_URL + '/api/auth/register', {
        username,
        password,
        name: finalName,
        role: isStudent ? 'STUDENT' : role
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto linear-card p-10 mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">Create Account</h2>
      
      <div className="flex justify-center mb-8 bg-gray-100 dark:bg-black/40 p-1 rounded-lg">
        <button 
          type="button"
          className={`flex-1 py-2 font-semibold text-sm rounded-md transition-all ${isStudent ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
          onClick={() => setIsStudent(true)}
        >
          Student
        </button>
        <button 
          type="button"
          className={`flex-1 py-2 font-semibold text-sm rounded-md transition-all ${!isStudent ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
          onClick={() => setIsStudent(false)}
        >
          Staff
        </button>
      </div>

      {!isStudent && (
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Staff Role</label>
          <select 
            className="linear-input"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="PROFESSOR">Professor</option>
            <option value="MESS">Mess Authority</option>
            <option value="SAC">Student Activity Center</option>
            <option value="FIC">Faculty In Charge</option>
            <option value="COMMITTEE">Committee Member</option>
          </select>
        </div>
      )}

      {success && <div className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-3 rounded mb-4 text-sm border border-green-200 dark:border-green-800/50">Registration successful! Redirecting to login...</div>}
      {error && <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-3 rounded mb-4 text-sm border border-red-200 dark:border-red-800/50">{error}</div>}
      
      <form onSubmit={handleRegister} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {isStudent ? 'Institute Email ID' : 'Email ID / Username'}
          </label>
          <input 
            type="text" 
            className="linear-input" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder={isStudent ? 'e.g. 25bcs092@iiitdmj.ac.in' : 'e.g. professor@iiitdmj.ac.in'}
          />
        </div>
        
        {!isStudent && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
            <input 
              type="text" 
              className="linear-input" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required={!isStudent}
              placeholder="e.g. Prof. John Doe"
            />
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
          <input 
            type="password" 
            className="linear-input" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>
        <button 
          type="submit" 
          className="linear-primary-button w-full py-3 mt-4"
        >
          Register
        </button>
      </form>
      
      <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account? <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">Log in here</Link>
      </div>
    </div>
  );
}

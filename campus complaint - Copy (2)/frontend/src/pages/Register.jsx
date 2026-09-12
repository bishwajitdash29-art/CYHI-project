import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [isStudent, setIsStudent] = useState(true);
  const [role, setRole] = useState('PROFESSOR');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      let finalName = name;
      if (isStudent) {
        finalName = "Student"; // Default name for students to remain anonymous
      }

      await axios.post('http://localhost:5000/api/auth/register', {
        username,
        password,
        name: finalName,
        role: isStudent ? 'STUDENT' : role
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 border dark:border-gray-700 rounded-lg shadow-sm mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">Register</h2>
      
      <div className="flex justify-center gap-4 mb-6 border-b dark:border-gray-700 pb-4">
        <label className="flex items-center gap-2 cursor-pointer dark:text-gray-200">
          <input 
            type="radio" 
            checked={isStudent} 
            onChange={() => setIsStudent(true)} 
            className="w-4 h-4"
          />
          Student
        </label>
        <label className="flex items-center gap-2 cursor-pointer dark:text-gray-200">
          <input 
            type="radio" 
            checked={!isStudent} 
            onChange={() => setIsStudent(false)} 
            className="w-4 h-4"
          />
          Staff
        </label>
      </div>

      {!isStudent && (
        <div className="mb-4">
          <label className="block font-medium mb-1 dark:text-gray-200">Staff Role</label>
          <select 
            className="w-full border dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white p-2 rounded focus:ring-blue-500 focus:border-blue-500"
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

      {success && <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 p-3 rounded mb-4">Registration successful! Redirecting to login...</div>}
      {error && <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-3 rounded mb-4">{error}</div>}
      
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block font-medium mb-1 dark:text-gray-200">
            {isStudent ? 'Institute Email ID' : 'Email ID / Username'}
          </label>
          <input 
            type="text" 
            className="w-full border dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white p-2 rounded focus:ring-blue-500 focus:border-blue-500" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        
        {/* Only ask for Name if it's Staff. Students are anonymous. */}
        {!isStudent && (
          <div>
            <label className="block font-medium mb-1 dark:text-gray-200">Full Name</label>
            <input 
              type="text" 
              className="w-full border dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white p-2 rounded focus:ring-blue-500 focus:border-blue-500" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required={!isStudent}
            />
          </div>
        )}
        
        <div>
          <label className="block font-medium mb-1 dark:text-gray-200">Password</label>
          <input 
            type="password" 
            className="w-full border dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white p-2 rounded focus:ring-blue-500 focus:border-blue-500" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 mt-2"
        >
          Register
        </button>
      </form>
      <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account? <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline">Login here</Link>
      </div>
    </div>
  );
}

import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [isStudent, setIsStudent] = useState(true);
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
        role: isStudent ? 'STUDENT' : 'PROFESSOR'
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 border rounded-lg shadow-sm mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
      
      <div className="flex justify-center gap-4 mb-6 border-b pb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="radio" 
            checked={isStudent} 
            onChange={() => setIsStudent(true)} 
            className="w-4 h-4"
          />
          Student
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="radio" 
            checked={!isStudent} 
            onChange={() => setIsStudent(false)} 
            className="w-4 h-4"
          />
          Staff
        </label>
      </div>

      {success && <div className="bg-green-100 text-green-800 p-3 rounded mb-4">Registration successful! Redirecting to login...</div>}
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      
      <form onSubmit={handleRegister} className="space-y-4">
        {!isStudent && (
          <div>
            <label className="block font-medium mb-1">Full Name</label>
            <input 
              type="text" 
              className="w-full border p-2 rounded focus:ring-blue-500 focus:border-blue-500" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required={!isStudent}
              placeholder="e.g. Prof. Bhartendu K. Singh"
            />
          </div>
        )}
        <div>
          <label className="block font-medium mb-1">{isStudent ? "Email ID / Roll No" : "Email ID"}</label>
          <input 
            type="text" 
            className="w-full border p-2 rounded focus:ring-blue-500 focus:border-blue-500" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder={isStudent ? "e.g. 25bcs002@iiitdmj.ac.in" : "e.g. director@iiitdmj.ac.in"}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Password</label>
          <input 
            type="password" 
            className="w-full border p-2 rounded focus:ring-blue-500 focus:border-blue-500" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Register
        </button>
      </form>
    </div>
  );
}

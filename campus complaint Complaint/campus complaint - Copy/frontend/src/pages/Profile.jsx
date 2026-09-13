import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    axios.get(API_URL + '/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setUser(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      navigate('/login');
    });
  }, [navigate]);

  if (loading) {
    return <div className="text-center mt-20 text-gray-500">Loading profile...</div>;
  }

  const rollNo = user.role === 'STUDENT' ? user.username.split('@')[0].toUpperCase() : null;

  return (
    <div className="max-w-xl mx-auto linear-card p-10 mt-10">
      <div className="flex items-center gap-6 mb-8 border-b border-gray-100 dark:border-white/10 pb-6">
        <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center text-3xl font-bold uppercase shadow-[0_0_15px_rgba(99,102,241,0.2)]">
          {user.name.charAt(0)}
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white uppercase tracking-wide">{user.name}</h2>
          <span className="inline-block mt-2 px-3 py-1 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-full border border-gray-200 dark:border-white/10 uppercase tracking-wider">
            {user.role}
          </span>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Official Email ID</h3>
          <div className="linear-input text-gray-900 dark:text-gray-200 opacity-80 cursor-default">{user.username}</div>
        </div>

        {rollNo && (
          <div>
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Institute Roll No</h3>
            <div className="linear-input text-gray-900 dark:text-gray-200 opacity-80 cursor-default">{rollNo}</div>
          </div>
        )}
      </div>

      <div className="mt-10 flex gap-4">
        <Link 
          to={user.role === 'COMMITTEE' ? '/dashboard/committee' : '/dashboard/user'} 
          className="flex-1 text-center linear-primary-button py-3 text-sm font-semibold"
        >
          Go to Dashboard
        </Link>
        <button 
          onClick={() => { localStorage.clear(); sessionStorage.clear(); window.location.href = '/'; }}
          className="flex-1 text-center linear-button py-3 text-sm font-semibold text-red-500 hover:text-red-400 border-red-500/20 hover:border-red-500/50 hover:bg-red-500/10"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

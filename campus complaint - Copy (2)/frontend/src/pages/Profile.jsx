import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

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

    axios.get('http://localhost:5000/api/auth/me', {
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
    <div className="max-w-xl mx-auto bg-white p-10 border rounded-2xl shadow-sm mt-10">
      <div className="flex items-center gap-6 mb-8 border-b pb-6">
        <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold uppercase">
          {user.name.charAt(0)}
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{user.name}</h2>
          <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full border border-gray-200">
            {user.role}
          </span>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Official Email ID</h3>
          <p className="text-lg font-medium text-gray-800 bg-gray-50 p-3 rounded border border-gray-100">{user.username}</p>
        </div>

        {rollNo && (
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Institute Roll No</h3>
            <p className="text-lg font-medium text-gray-800 bg-gray-50 p-3 rounded border border-gray-100">{rollNo}</p>
          </div>
        )}
      </div>

      <div className="mt-10 flex gap-4">
        <Link 
          to={user.role === 'COMMITTEE' ? '/dashboard/committee' : '/dashboard/user'} 
          className="flex-1 text-center bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
        >
          Go to Dashboard
        </Link>
        <button 
          onClick={() => { localStorage.clear(); sessionStorage.clear(); window.location.href = '/'; }}
          className="flex-1 text-center bg-gray-100 text-red-600 py-3 rounded-lg font-bold hover:bg-red-50 transition border border-red-100"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

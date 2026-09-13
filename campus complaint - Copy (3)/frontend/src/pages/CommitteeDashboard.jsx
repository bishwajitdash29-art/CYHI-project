import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CommitteeDashboard() {
  const [complaints, setComplaints] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    axios.get('http://localhost:5000/api/complaints', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setComplaints(res.data.complaints || []))
    .catch(err => {
      console.error(err);
      navigate('/login');
    });
  }, [navigate]);

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded border dark:border-gray-700">
        <h2 className="text-xl font-bold dark:text-white">Feedback Management Committee Dashboard</h2>
        <button onClick={logout} className="text-red-600 dark:text-red-400 hover:underline">Logout</button>
      </div>

      <div className="grid gap-4">
        {complaints.length === 0 ? (
          <p className="dark:text-gray-300">No complaints filed yet.</p>
        ) : complaints.map(c => (
          <div key={c.id} className="bg-white dark:bg-gray-800 p-6 border dark:border-gray-700 rounded shadow-sm">
            <div className="flex justify-between">
              <div>
                <h3 className="font-bold text-lg dark:text-white">{c.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Against: {c.target?.role === 'PROFESSOR' ? 'Prof. ' : ''}{c.target?.name}</p>
              </div>
              <span className={`px-2 py-1 h-fit text-xs font-bold rounded ${
                  c.status === 'RESOLVED' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' : 
                  c.status === 'IN_PROGRESS' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400' :
                  c.status === 'REOPENED' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400' :
                  'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'
                }`}>
                {c.status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mt-2">{c.description}</p>
            
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <h4 className="text-sm font-semibold mb-2 text-gray-600 dark:text-gray-400">Replies ({c.replies?.length || 0})</h4>
              {c.replies && c.replies.map(r => (
                <div key={r.id} className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-750 p-2 rounded mb-1 border border-gray-200 dark:border-gray-600">
                  <span className="font-semibold dark:text-white">{r.userId === c.targetId ? c.target?.role : 'Committee'}: </span> 
                  {r.message}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

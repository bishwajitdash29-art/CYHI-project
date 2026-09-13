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
    <div className="space-y-6 mt-10 max-w-5xl mx-auto">
      <div className="flex justify-between items-center linear-card p-6">
        <h2 className="text-2xl font-bold dark:text-white text-gray-900">Feedback Management Committee</h2>
        <button onClick={logout} className="text-red-500 hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors text-sm">Logout</button>
      </div>

      <div className="grid gap-6">
        {complaints.length === 0 ? (
          <div className="linear-card p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No complaints filed yet.</p>
          </div>
        ) : complaints.map(c => (
          <div key={c.id} className="linear-card p-6 md:p-8 hover:border-gray-300 dark:hover:border-white/20 transition-all">
            <div className="flex justify-between items-start mb-4 border-b border-gray-100 dark:border-white/10 pb-4">
              <div>
                <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">{c.title}</h3>
                <div className="flex items-center gap-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <span className="bg-gray-100 dark:bg-white/10 px-2 py-1 rounded">ID: {c.trackingToken}</span>
                  <span>Filed: {new Date(c.createdAt).toLocaleDateString()}</span>
                  <span>Against: {c.target?.role === 'PROFESSOR' ? 'Prof. ' : ''}{c.target?.name}</span>
                </div>
              </div>
              <span className={`px-3 py-1 h-fit text-xs font-bold uppercase tracking-wider rounded-full ${
                  c.status === 'RESOLVED' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' : 
                  c.status === 'IN_PROGRESS' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400' :
                  c.status === 'REOPENED' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400' :
                  'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-400'
                }`}>
                {c.status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-6">{c.description}</p>
            
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/10">
              <h4 className="text-sm font-bold mb-3 text-gray-900 dark:text-gray-300">Communication Timeline ({c.replies?.length || 0})</h4>
              <div className="space-y-2">
                {c.replies && c.replies.map(r => (
                  <div key={r.id} className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-white/5 p-3 rounded-lg border border-gray-100 dark:border-white/10">
                    <div className="flex justify-between mb-1">
                      <span className="font-bold text-gray-900 dark:text-gray-200">{r.user ? `${r.user.name} (${r.user.role})` : 'System'}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(r.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="mt-1">{r.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

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
    .then(res => setComplaints(res.data))
    .catch(err => console.error(err));
  }, [navigate]);

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded border">
        <h2 className="text-xl font-bold">Feedback Management Committee Dashboard</h2>
        <button onClick={logout} className="text-red-600 hover:underline">Logout</button>
      </div>

      <div className="grid gap-4">
        {complaints.length === 0 ? (
          <p>No complaints filed yet.</p>
        ) : complaints.map(c => (
          <div key={c.id} className="bg-white p-6 border rounded shadow-sm">
            <div className="flex justify-between">
              <div>
                <h3 className="font-bold text-lg">{c.title}</h3>
                <p className="text-sm text-gray-500">Against: {c.target?.role === 'PROFESSOR' ? 'Prof. ' : ''}{c.target?.name}</p>
              </div>
              <span className={`px-2 py-1 h-fit text-xs font-bold rounded ${c.status === 'RESOLVED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {c.status}
              </span>
            </div>
            <p className="text-gray-700 mt-2">{c.description}</p>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h4 className="text-sm font-semibold mb-2 text-gray-600">Replies ({c.replies?.length || 0})</h4>
              {c.replies && c.replies.map(r => (
                <div key={r.id} className="text-sm text-gray-700 bg-gray-50 p-2 rounded mb-1 border border-gray-200">
                  <span className="font-semibold">{r.userId === c.targetId ? c.target?.role : 'Committee'}: </span> 
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

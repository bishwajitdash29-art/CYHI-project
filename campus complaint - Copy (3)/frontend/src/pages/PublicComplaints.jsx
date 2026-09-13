import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Clock, CheckCircle } from 'lucide-react';

export default function PublicComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [activeTab, setActiveTab] = useState('PENDING'); // 'PENDING' or 'RESOLVED'

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    axios.get('http://localhost:5000/api/complaints/public', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setComplaints(res.data))
      .catch(err => console.error(err));
  }, []);

  const pendingComplaints = complaints.filter(c => c.status !== 'RESOLVED');
  const resolvedComplaints = complaints.filter(c => c.status === 'RESOLVED');

  const displayedComplaints = activeTab === 'PENDING' ? pendingComplaints : resolvedComplaints;

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="bg-white dark:bg-gray-800 p-8 border dark:border-gray-700 rounded-lg shadow-sm">
        <h2 className="text-3xl font-bold mb-6 text-center dark:text-white">Public Grievances Wall</h2>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
          A transparent view of all anonymized complaints filed across the campus and their current resolution status.
        </p>

        <div className="flex justify-center border-b dark:border-gray-700 mb-6">
          <button
            className={`px-8 py-3 font-semibold text-lg flex items-center gap-2 ${activeTab === 'PENDING' ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
            onClick={() => setActiveTab('PENDING')}
          >
            <Clock size={20} /> Pending ({pendingComplaints.length})
          </button>
          <button
            className={`px-8 py-3 font-semibold text-lg flex items-center gap-2 ${activeTab === 'RESOLVED' ? 'border-b-2 border-green-600 text-green-600 dark:text-green-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
            onClick={() => setActiveTab('RESOLVED')}
          >
            <CheckCircle size={20} /> Resolved ({resolvedComplaints.length})
          </button>
        </div>

        <div className="space-y-4">
          {displayedComplaints.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400 italic">
              No {activeTab.toLowerCase()} complaints found.
            </div>
          ) : (
            displayedComplaints.map(c => (
              <div key={c.id} className="p-6 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 transition hover:shadow-md">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{c.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    c.status === 'RESOLVED' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                    c.status === 'IN_PROGRESS' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400' :
                    c.status === 'AWAITING_REVIEW' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400' :
                    c.status === 'REOPENED' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400' :
                    'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'
                  }`}>
                    {c.status.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="flex flex-col gap-1 mb-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    Filed against: <span className="text-gray-800 dark:text-gray-200">{c.targetName ? `${c.targetRole === 'PROFESSOR' ? 'Prof. ' : ''}${c.targetName}` : 'Unknown'}</span>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    Tracking ID: <span className="font-mono bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-800 dark:text-gray-300 select-all">{c.trackingToken}</span>
                  </p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-4 rounded border dark:border-gray-700 text-gray-700 dark:text-gray-300">
                  {c.description}
                </div>
                
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-right">
                  Filed on: {new Date(c.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

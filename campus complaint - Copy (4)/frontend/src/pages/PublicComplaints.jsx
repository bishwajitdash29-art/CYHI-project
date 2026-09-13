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
    <div className="max-w-5xl mx-auto space-y-8 mt-10">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Public Wall</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
          Anonymized overview of all campus issues. Track institutional progress and committee responsiveness in real-time.
        </p>
      </div>

      <div className="flex justify-center gap-4 mb-8">
        <button 
          className={`linear-button px-8 py-2.5 font-semibold text-sm ${activeTab === 'PENDING' ? 'border-indigo-500/50 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400' : ''}`}
          onClick={() => setActiveTab('PENDING')}
        >
          Active Issues
        </button>
        <button 
          className={`linear-button px-8 py-2.5 font-semibold text-sm ${activeTab === 'RESOLVED' ? 'border-indigo-500/50 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400' : ''}`}
          onClick={() => setActiveTab('RESOLVED')}
        >
          Resolved Issues
        </button>
      </div>

      <div className="grid gap-6">
        {displayedComplaints.length === 0 ? (
          <div className="linear-card p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No {activeTab.toLowerCase()} issues at the moment.</p>
          </div>
        ) : displayedComplaints.map(c => (
          <div key={c.id} className="linear-card p-6 md:p-8 hover:border-gray-300 dark:hover:border-white/20 transition-all">
            <div className="flex justify-between items-start mb-4 border-b border-gray-100 dark:border-white/10 pb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{c.title}</h3>
                <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <span className="bg-gray-100 dark:bg-white/10 px-2 py-1 rounded">ID: {c.trackingToken}</span>
                  <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                  <span>Filed against: {c.targetName ? `${c.targetRole === 'PROFESSOR' ? 'Prof. ' : ''}${c.targetName}` : 'Unknown'}</span>
                </div>
              </div>
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
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{c.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

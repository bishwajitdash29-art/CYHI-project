import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Clock, CheckCircle, Repeat } from 'lucide-react';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function PublicComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [activeTab, setActiveTab] = useState('PENDING'); // 'PENDING' or 'RESOLVED'

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    axios.get(API_URL + '/api/complaints/public', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setComplaints(res.data))
      .catch(err => console.error(err));
  };

  const handleRepost = async (id) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) return; // Must be logged in

    try {
      await axios.post(`${API_URL}/api/complaints/${id}/repost`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchComplaints(); // Refresh data to get new counts
    } catch (err) {
      console.error(err);
    }
  };

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

      <div className="flex justify-center mb-10">
        <div className="bg-gray-100 dark:bg-white/5 p-1 rounded-lg flex border border-gray-200 dark:border-white/10">
          <button 
            className={`px-8 py-2 font-semibold text-sm rounded-md transition-all ${activeTab === 'PENDING' ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('PENDING')}
          >
            Active Issues
          </button>
          <button 
            className={`px-8 py-2 font-semibold text-sm rounded-md transition-all ${activeTab === 'RESOLVED' ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('RESOLVED')}
          >
            Resolved Issues
          </button>
        </div>
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
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                c.status === 'RESOLVED' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                c.status === 'IN_PROGRESS' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                c.status === 'AWAITING_REVIEW' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                c.status === 'REOPENED' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
              }`}>
                {c.status.replace('_', ' ')}
              </span>
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{c.description}</p>
              <div className="flex items-center gap-4 border-t border-gray-100 dark:border-white/5 pt-4">
                <button 
                  onClick={() => handleRepost(c.id)}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${
                    c.hasReposted 
                      ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30' 
                      : 'bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10'
                  }`}
                >
                  <Repeat size={14} className={c.hasReposted ? 'text-indigo-600 dark:text-indigo-400' : ''} />
                  {c.hasReposted ? 'Reposted' : 'Repost'}
                </button>
                {c.repostCount > 0 && (
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {c.repostCount} {c.repostCount === 1 ? 'student has' : 'students have'} this same issue
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

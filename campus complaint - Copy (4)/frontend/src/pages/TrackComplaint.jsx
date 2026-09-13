import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { Clock, MessageSquare } from 'lucide-react';

export default function TrackComplaint() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialToken = searchParams.get('token') || '';
  
  const [searchToken, setSearchToken] = useState(initialToken);
  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newReply, setNewReply] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);

  const fetchComplaint = async (searchToken) => {
    if (!searchToken) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`http://localhost:5000/api/complaints/track/${searchToken}`);
      setComplaint(res.data);
      setSearchParams({ token: searchToken });
    } catch (err) {
      setError('Complaint not found or invalid token');
      setComplaint(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (initialToken) {
      fetchComplaint(initialToken);
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchComplaint(searchToken);
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!newReply.trim() || !complaint) return;
    setReplyLoading(true);
    try {
      const res = await axios.post(`http://localhost:5000/api/complaints/track/${searchToken}/reply`, {
        content: newReply
      });
      setComplaint(res.data);
      setNewReply('');
    } catch (err) {
      setError('Failed to send reply');
    }
    setReplyLoading(false);
  };

  const handleReviewAction = async (resolution) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/complaints/track/${searchToken}/review`, { resolution });
      setComplaint(res.data);
    } catch (err) {
      setError('Failed to submit review');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="linear-card p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Track Your Issue</h2>
        
        <form onSubmit={handleSearch} className="flex gap-4">
          <input 
            type="text" 
            placeholder="Enter your 16-character tracking token..." 
            className="linear-input flex-1"
            value={searchToken}
            onChange={(e) => setSearchToken(e.target.value)}
            required
          />
          <button type="submit" className="linear-primary-button px-6 py-2" disabled={loading}>
            {loading ? 'Searching...' : 'Track'}
          </button>
        </form>
        {error && <p className="text-red-500 mt-4 text-sm font-medium">{error}</p>}
      </div>

      {complaint && (
        <div className="linear-card p-8">
          <div className="flex justify-between items-start mb-6 border-b border-gray-100 dark:border-white/10 pb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{complaint.title}</h3>
                <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                  complaint.status === 'RESOLVED' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' :
                  complaint.status === 'REOPENED' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' :
                  complaint.status === 'AWAITING_REVIEW' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400' :
                  'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400'
                }`}>
                  {complaint.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Assigned to: {complaint.target ? `${complaint.target.name} (${complaint.target.role})` : 'Committee'}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Filed on</p>
              <p className="text-sm text-gray-900 dark:text-gray-300">{new Date(complaint.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="mb-8">
            <h4 className="text-sm font-bold text-gray-900 dark:text-gray-300 mb-2">Original Description</h4>
            <p className="text-gray-700 dark:text-gray-400 bg-gray-50 dark:bg-white/5 p-4 rounded-lg border border-gray-100 dark:border-white/10 leading-relaxed text-sm">{complaint.description}</p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-900 dark:text-gray-300">Timeline</h4>
            <div className="space-y-3">
              {complaint.replies.map(reply => (
                <div key={reply.id} className="p-4 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-sm text-gray-900 dark:text-gray-200">
                      {reply.user ? `${reply.user.name} (${reply.user.role})` : 'Anonymous Student (You)'}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(reply.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">{reply.message}</p>
                </div>
              ))}
              {complaint.replies.length === 0 && (
                <p className="text-gray-500 dark:text-gray-500 text-sm italic">No updates yet.</p>
              )}
            </div>
          </div>

          {complaint.status === 'AWAITING_REVIEW' && (
            <div className="mt-8 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/50 p-6 rounded-lg text-center shadow-sm">
              <h3 className="text-lg font-bold text-purple-800 dark:text-purple-300 mb-2">Review Action Required</h3>
              <p className="text-purple-700 dark:text-purple-400 text-sm mb-6">The assigned authority has replied. Is your issue resolved?</p>
              <div className="flex justify-center gap-4">
                <button 
                  onClick={() => handleReviewAction('RESOLVED')}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition"
                >
                  Yes, Issue Resolved
                </button>
                <button 
                  onClick={() => handleReviewAction('REOPENED')}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition"
                >
                  No, Reopen Issue
                </button>
              </div>
            </div>
          )}

          {complaint.replies.length > 0 && complaint.status !== 'AWAITING_REVIEW' && complaint.status !== 'RESOLVED' && (
            <form onSubmit={handleReply} className="mt-8 border-t border-gray-100 dark:border-white/10 pt-6">
              <h4 className="text-sm font-bold text-gray-900 dark:text-gray-300 mb-3">Add Follow-up (Anonymous)</h4>
              <textarea
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                className="linear-input mb-3"
                rows="3"
                placeholder="Type your response..."
                required
              ></textarea>
              <button 
                type="submit" 
                disabled={replyLoading}
                className="linear-button px-6 py-2 text-sm font-medium disabled:opacity-50"
              >
                {replyLoading ? 'Sending...' : 'Send Reply'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

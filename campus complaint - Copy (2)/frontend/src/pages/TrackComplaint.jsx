import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

export default function TrackComplaint() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialToken = searchParams.get('token') || '';
  
  const [token, setToken] = useState(initialToken);
  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 border dark:border-gray-700 rounded-lg shadow-sm mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">Track Your Complaint</h2>
      {error && <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-3 rounded mb-4">{error}</div>}
      
      <form onSubmit={handleSearch} className="flex gap-4 mb-8">
        <input 
          type="text" 
          className="flex-1 border dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white p-2 rounded focus:ring-blue-500 focus:border-blue-500 font-mono tracking-widest text-center uppercase" 
          value={searchToken}
          onChange={(e) => setSearchToken(e.target.value)}
          placeholder="ENTER TRACKING TOKEN"
          required
        />
        <button 
          type="submit" 
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Track'}
        </button>
      </form>

      {complaint && (
        <div className="space-y-6">
          <div className="border dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-750">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{complaint.title}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                complaint.status === 'RESOLVED' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                complaint.status === 'IN_PROGRESS' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400' :
                'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'
              }`}>
                {complaint.status.replace('_', ' ')}
              </span>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-4 bg-white dark:bg-gray-800 p-4 border dark:border-gray-600 rounded">
              {complaint.description}
            </p>
            
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1"><Clock size={16}/> {new Date(complaint.createdAt).toLocaleString()}</div>
              <div>Against: <span className="font-semibold text-gray-700 dark:text-gray-300">{complaint.target?.name || 'Unknown'}</span></div>
            </div>
          </div>

          <div className="mt-8">
            <h4 className="text-lg font-bold mb-4 flex items-center gap-2 dark:text-white"><MessageSquare size={20}/> Communication Timeline</h4>
            
            <div className="space-y-4">
              {complaint.replies.map(reply => (
                <div key={reply.id} className={`p-4 rounded-lg border dark:border-gray-700 ${reply.user?.role === 'STUDENT' ? 'bg-blue-50 dark:bg-blue-900/20 ml-8' : 'bg-gray-50 dark:bg-gray-750 mr-8'}`}>
                  <div className="flex justify-between mb-2">
                    <span className="font-bold text-sm text-gray-800 dark:text-gray-200">
                      {reply.user ? (reply.user.role === 'STUDENT' ? 'You' : `${reply.user.name} (${reply.user.role})`) : 'System'}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(reply.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{reply.content}</p>
                </div>
              ))}
              {complaint.replies.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-center italic py-4">No replies yet. Check back later.</p>
              )}
            </div>
          </div>

          <form onSubmit={handleReply} className="mt-6 border-t dark:border-gray-700 pt-6">
            <h4 className="font-semibold mb-2 dark:text-gray-200">Send an Anonymous Reply</h4>
            <textarea
              className="w-full border dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white p-3 rounded mb-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
              value={newReply}
              onChange={e => setNewReply(e.target.value)}
              placeholder="Provide more details or respond to questions..."
              required
            ></textarea>
            <button 
              type="submit"
              disabled={replyLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {replyLoading ? 'Sending...' : 'Send Reply'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

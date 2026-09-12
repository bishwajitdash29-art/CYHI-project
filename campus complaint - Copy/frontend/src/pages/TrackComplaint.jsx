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
    fetchComplaint(token);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-6 border rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4">Track Your Complaint</h2>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input 
            type="text" 
            placeholder="Enter Tracking Token" 
            className="flex-1 border p-2 rounded"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            {loading ? 'Searching...' : 'Track'}
          </button>
        </form>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>

      {complaint && (
        <div className="bg-white p-6 border rounded-lg shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold">{complaint.title}</h3>
              <p className="text-gray-600 mt-1">Against: Professor {complaint.professor?.name}</p>
            </div>
            <span className={`px-3 py-1 rounded text-sm font-semibold 
              ${complaint.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                complaint.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' : 
                'bg-green-100 text-green-800'}`}>
              {complaint.status.replace('_', ' ')}
            </span>
          </div>
          <div className="bg-gray-50 p-4 rounded text-gray-800 border">
            {complaint.description}
          </div>
          
          <div className="mt-8">
            <h4 className="font-bold text-lg mb-4">Updates & Replies</h4>
            {complaint.replies?.length === 0 ? (
              <p className="text-gray-500 italic">No replies yet.</p>
            ) : (
              <div className="space-y-4">
                {complaint.replies.map(reply => (
                  <div key={reply.id} className={`p-4 rounded border ${reply.user.role === 'COMMITTEE' ? 'bg-indigo-50 border-indigo-100' : 'bg-white border-gray-200'}`}>
                    <div className="flex justify-between text-sm text-gray-500 mb-2">
                      <span className="font-semibold text-gray-700">{reply.user.name} ({reply.user.role})</span>
                      <span>{new Date(reply.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-gray-800">{reply.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

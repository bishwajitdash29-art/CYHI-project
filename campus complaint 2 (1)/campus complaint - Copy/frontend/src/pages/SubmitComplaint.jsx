import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function SubmitComplaint() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetRole, setTargetRole] = useState('PROFESSOR');
  const [targetId, setTargetId] = useState('');
  const [targets, setTargets] = useState([]);
  const [trackingToken, setTrackingToken] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/complaints/targets?role=${targetRole}`)
      .then(res => setTargets(res.data))
      .catch(err => console.error(err));
  }, [targetRole]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const headers = {};
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await axios.post('http://localhost:5000/api/complaints', {
        title,
        description,
        targetId
      }, { headers });
      setTrackingToken(res.data.trackingToken);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    }
    setLoading(false);
  };

  if (trackingToken) {
    return (
      <div className="max-w-md mx-auto bg-white p-8 border rounded-lg shadow-sm text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Complaint Submitted Successfully!</h2>
        <p className="mb-4 text-gray-700">Please save your tracking token to check updates from the committee or accused.</p>
        <div className="bg-gray-100 p-4 rounded text-xl font-mono mb-6 select-all">
          {trackingToken}
        </div>
        <Link to={`/track?token=${trackingToken}`} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Track it now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto bg-white p-8 border rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Submit Anonymous Complaint</h2>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="flex gap-4 mb-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              checked={targetRole === 'PROFESSOR'} 
              onChange={() => { setTargetRole('PROFESSOR'); setTargetId(''); }} 
              className="w-4 h-4"
            />
            Complain against Professor
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              checked={targetRole === 'STUDENT'} 
              onChange={() => { setTargetRole('STUDENT'); setTargetId(''); }} 
              className="w-4 h-4"
            />
            Complain against Student
          </label>
        </div>

        <div>
          <label className="block font-medium mb-1">Select {targetRole === 'PROFESSOR' ? 'Professor' : 'Student'}</label>
          <select 
            className="w-full border p-2 rounded focus:ring-blue-500 focus:border-blue-500"
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            required
          >
            <option value="">-- Select --</option>
            {targets.map(t => (
              <option key={t.id} value={t.id}>{t.name} {t.role === 'STUDENT' ? `(${t.username})` : ''}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input 
            type="text" 
            className="w-full border p-2 rounded" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea 
            className="w-full border p-2 rounded h-32" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Anonymously'}
        </button>
      </form>
    </div>
  );
}

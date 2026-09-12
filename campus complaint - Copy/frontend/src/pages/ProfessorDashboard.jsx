import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ProfessorDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
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

  const handleReply = async (complaintId) => {
    if (!replyText) return;
    const token = localStorage.getItem('token');
    try {
      await axios.post(`http://localhost:5000/api/complaints/${complaintId}/reply`, 
        { message: replyText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReplyText('');
      setSelectedComplaint(null);
      alert('Reply sent!');
    } catch (err) {
      console.error(err);
      alert('Failed to send reply');
    }
  };

  const handleStatusChange = async (complaintId, status) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/api/complaints/${complaintId}/status`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComplaints(complaints.map(c => c.id === complaintId ? { ...c, status } : c));
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded border">
        <h2 className="text-xl font-bold">Professor Dashboard</h2>
        <button onClick={logout} className="text-red-600 hover:underline">Logout</button>
      </div>

      <div className="grid gap-4">
        {complaints.length === 0 ? (
          <p>No complaints assigned to you.</p>
        ) : complaints.map(c => (
          <div key={c.id} className="bg-white p-6 border rounded shadow-sm">
            <div className="flex justify-between">
              <h3 className="font-bold text-lg">{c.title}</h3>
              <select 
                value={c.status} 
                onChange={(e) => handleStatusChange(c.id, e.target.value)}
                className="border rounded text-sm p-1"
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
              </select>
            </div>
            <p className="text-gray-700 mt-2">{c.description}</p>
            <p className="text-xs text-gray-400 mt-2">Date: {new Date(c.createdAt).toLocaleString()}</p>
            
            <div className="mt-4">
              {selectedComplaint === c.id ? (
                <div className="space-y-2 mt-2">
                  <textarea 
                    className="w-full border rounded p-2 text-sm"
                    rows="3"
                    placeholder="Type your response..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  ></textarea>
                  <div className="flex gap-2">
                    <button onClick={() => handleReply(c.id)} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Send</button>
                    <button onClick={() => setSelectedComplaint(null)} className="bg-gray-300 px-3 py-1 rounded text-sm">Cancel</button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setSelectedComplaint(c.id)}
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  Reply to this complaint
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

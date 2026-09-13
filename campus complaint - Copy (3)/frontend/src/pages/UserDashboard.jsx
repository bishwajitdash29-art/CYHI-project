import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function UserDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [escalatedComplaints, setEscalatedComplaints] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
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
    .then(res => {
      // res.data is now { complaints, currentUserId }
      setComplaints(res.data.complaints || []);
      // Can also store currentUserId in state if needed, but not strictly required
    })
    .catch(err => console.error(err));

    // Check for escalated complaints (will return empty unless user is Director)
    axios.get('http://localhost:5000/api/complaints/escalated', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setEscalatedComplaints(res.data))
    .catch(err => console.error(err));
  }, [navigate]);

  const handleReply = async (complaintId) => {
    if (!replyText) return;
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
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
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
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

  const handlePing = async (complaintId) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    try {
      await axios.post(`http://localhost:5000/api/complaints/${complaintId}/ping`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Ping sent successfully to the targeted authority!');
    } catch (err) {
      console.error(err);
      alert('Failed to ping');
    }
  };

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/');
  };

  const role = localStorage.getItem('role') || sessionStorage.getItem('role') || 'User';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded border dark:border-gray-700">
        <h2 className="text-xl font-bold dark:text-white">{role.charAt(0) + role.slice(1).toLowerCase()} Dashboard</h2>
        <button onClick={logout} className="text-red-600 dark:text-red-400 hover:underline">Logout</button>
      </div>

      {escalatedComplaints.length > 0 && (
        <div className="mb-10 bg-red-50 dark:bg-red-900/10 p-6 rounded-lg border border-red-200 dark:border-red-800/50">
          <h2 className="text-xl font-bold text-red-700 dark:text-red-400 mb-4">Director Escalations View (Overdue Tickets)</h2>
          <div className="grid gap-4">
            {escalatedComplaints.map(ec => (
              <div key={ec.id} className="bg-white dark:bg-gray-800 p-4 border border-red-200 dark:border-red-800 rounded shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg dark:text-white">{ec.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Failed SLA against: <span className="font-semibold text-gray-900 dark:text-gray-200">{ec.target?.name}</span></p>
                  </div>
                  <button 
                    onClick={() => handlePing(ec.id)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-1.5 px-4 rounded shadow transition text-sm"
                  >
                    Ping Authority Urgently
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Your Tickets</h2>
      <div className="grid gap-4">
        {complaints.length === 0 ? (
          <p className="dark:text-gray-300">No complaints found.</p>
        ) : complaints.map(c => {
          // Check 2 minute SLA logic
          const isOverdue = (new Date() - new Date(c.createdAt)) > (2 * 60 * 1000);
          const slaStatus = isOverdue ? 'FAILED 2-MIN SLA' : 'Deadline: 2 Days';
          const isPingedByDirector = c.replies && c.replies.some(r => r.user?.username === 'director@iiitdmj.ac.in');

          return (
          <div key={c.id} className={`p-6 border rounded-lg shadow-sm ${c.status === 'REOPENED' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : isPingedByDirector ? 'bg-red-50 dark:bg-red-900/40 border-red-500' : 'bg-white dark:bg-gray-800 dark:border-gray-700'}`}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg dark:text-white flex items-center gap-2">
                  {c.title}
                  {c.status === 'REOPENED' && <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">NOT RESOLVED (ACTION REQUIRED)</span>}
                  {isPingedByDirector && <span className="bg-red-700 text-white font-bold uppercase text-xs px-2 py-1 rounded animate-pulse">ESCALATED: PINGED BY DIRECTOR</span>}
                </h3>
                <div className="text-xs font-semibold text-gray-500 mt-1 flex flex-wrap items-center gap-2">
                  <span>Tracking ID: <span className="font-mono bg-gray-200 dark:bg-gray-700 px-1 rounded">{c.trackingToken}</span></span>
                  <span>| Date: {new Date(c.createdAt).toLocaleString()}</span>
                  {(c.status === 'PENDING' || c.status === 'REOPENED') && (
                    <span className={`px-2 py-0.5 rounded ${isOverdue ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400'}`}>
                      {slaStatus}
                    </span>
                  )}
                </div>
              </div>
              
              {c.status === 'AWAITING_REVIEW' ? (
                <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 px-3 py-1 rounded font-bold text-sm">
                  Sent for review
                </span>
              ) : (
                <select 
                  value={c.status} 
                  onChange={(e) => handleStatusChange(c.id, e.target.value)}
                  className="border dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded text-sm p-1"
                >
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="AWAITING_REVIEW">Awaiting Review</option>
                  <option value="REOPENED">Reopened</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
              )}
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 mt-4 bg-gray-50 dark:bg-gray-750 p-3 rounded border dark:border-gray-600">{c.description}</p>
            
            {c.replies && c.replies.length > 0 && (
              <div className="mt-4 border-t dark:border-gray-700 pt-4 space-y-3">
                <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">Communication Timeline</h4>
                {c.replies.map(reply => {
                  const isDirector = reply.user?.username === 'director@iiitdmj.ac.in';
                  return (
                    <div key={reply.id} className={`p-3 rounded border dark:border-gray-700 ${isDirector ? 'bg-red-50 dark:bg-red-900/20 border-red-200' : 'bg-white dark:bg-gray-800'}`}>
                      <div className="flex justify-between mb-1">
                        <span className={`text-xs font-bold ${isDirector ? 'text-red-700 dark:text-red-400' : 'text-gray-800 dark:text-gray-200'}`}>
                          {reply.user ? `${reply.user.name} (${reply.user.role})` : 'System'}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(reply.createdAt).toLocaleString()}</span>
                      </div>
                      <p className={`text-sm ${isDirector ? 'text-red-700 dark:text-red-300 font-medium' : 'text-gray-700 dark:text-gray-300'}`}>{reply.message}</p>
                    </div>
                  );
                })}
              </div>
            )}
            
            <div className="mt-4 border-t dark:border-gray-700 pt-4">
              {selectedComplaint === c.id ? (
                <div className="space-y-2">
                  <textarea 
                    className="w-full border dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded p-2 text-sm"
                    rows="3"
                    placeholder="Type your response to send for review..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  ></textarea>
                  <div className="flex gap-2">
                    <button onClick={() => handleReply(c.id)} className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-blue-700 transition">Send Reply & Update Status</button>
                    <button onClick={() => setSelectedComplaint(null)} className="bg-gray-300 dark:bg-gray-600 dark:text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-gray-400 transition">Cancel</button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setSelectedComplaint(c.id)}
                  className="text-blue-600 dark:text-blue-400 text-sm font-bold hover:underline"
                >
                  Reply to this complaint
                </button>
              )}
            </div>
          </div>
        )})}
      </div>
    </div>
  );
}

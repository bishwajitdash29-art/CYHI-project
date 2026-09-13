import { useState, useEffect } from "react";
import axios from "axios";
import { ThumbsUp, PlusCircle, CheckCircle, XCircle } from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Proposals() {
  const [proposals, setProposals] = useState([]);
  const [showSubmit, setShowSubmit] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("General");
  const [error, setError] = useState(null);

  const role = localStorage.getItem("role") || sessionStorage.getItem("role");
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const isStudent = role === "STUDENT";
  const isAdmin = role === "COMMITTEE" || role === "SAC" || (role && !isStudent);

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(API_URL + "/api/proposals", { headers });
      setProposals(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpvote = async (id) => {
    if (!token) return alert("Please login to upvote.");
    try {
      await axios.post(`${API_URL}/api/proposals/${id}/upvote`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProposals();
    } catch (err) {
      alert("Failed to upvote");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;
    try {
      await axios.post(API_URL + "/api/proposals", { title, description, department }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTitle("");
      setDescription("");
      setDepartment("General");
      setShowSubmit(false);
      fetchProposals();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit proposal");
    }
  };

  const handleStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/api/proposals/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProposals();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold dark:text-white text-gray-900">Campus Proposals</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Suggest new ideas and upvote the best ones! (100% Anonymous)</p>
        </div>
        {isStudent && (
          <button 
            onClick={() => setShowSubmit(!showSubmit)}
            className="linear-primary-button flex items-center gap-2"
          >
            <PlusCircle size={18} />
            New Proposal
          </button>
        )}
      </div>

      {showSubmit && (
        <div className="linear-card p-6 mb-8 border-indigo-500/30">
          <h3 className="text-xl font-bold dark:text-white mb-4">Submit an Anonymous Idea</h3>
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input 
              type="text"
              placeholder="Short, clear title"
              className="linear-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <select
              className="linear-input"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            >
              <option value="General Campus">General Campus</option>
              <option value="Head of CSE">Head of CSE</option>
              <option value="Electronics">Head of ECE</option>
              <option value="Mechanical">Head of ME</option>
              <option value="Student Activity Center">SAC Director</option>
            </select>
            <textarea 
              placeholder="Why do we need this?"
              className="linear-input min-h-[100px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowSubmit(false)} className="linear-button">Cancel</button>
              <button type="submit" className="linear-primary-button">Post Idea</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {proposals.length === 0 ? (
          <p className="text-gray-500 text-center py-10">No proposals yet. Be the first!</p>
        ) : (
          proposals.map(p => (
            <div key={p.id} className="linear-card p-5 flex gap-6">
              <div className="flex flex-col items-center justify-start pt-2">
                <button 
                  onClick={() => handleUpvote(p.id)}
                  className={`flex flex-col items-center justify-center w-14 h-16 rounded-xl border transition-all ${p.hasUpvoted ? "bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-500/20 dark:border-indigo-500/50 dark:text-indigo-400" : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100 dark:bg-white/5 dark:border-white/10 dark:text-gray-400 dark:hover:bg-white/10"}`}
                >
                  <ThumbsUp size={18} className="mb-1" fill={p.hasUpvoted ? "currentColor" : "none"} />
                  <span className="font-bold text-sm">{p.upvoteCount}</span>
                </button>
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold dark:text-white text-gray-900">{p.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                      <span className="font-medium text-gray-700 dark:text-gray-300">Anonymous</span>
                      <span>•</span>
                      <span>Target: <span className="font-medium text-indigo-500">{p.department}</span></span>
                      <span>•</span>
                      <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                    </p>
                  </div>
                  <div>
                    {p.status === "OPEN" && <span className="bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase">Seeking Votes</span>}
                    {p.status === "IN_REVIEW" && <span className="bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase">In Review (Threshold Met)</span>}
                    {p.status === "APPROVED" && <span className="bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400 border border-green-500/20 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase flex items-center gap-1"><CheckCircle size={14}/> Approved</span>}
                    {p.status === "DENIED" && <span className="bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400 border border-red-500/20 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase flex items-center gap-1"><XCircle size={14}/> Denied</span>}
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mt-4 leading-relaxed">{p.description}</p>
                
                {isAdmin && p.status === "IN_REVIEW" && (
                  <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/10 flex gap-3">
                    <button onClick={() => handleStatus(p.id, "APPROVED")} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">Approve</button>
                    <button onClick={() => handleStatus(p.id, "DENIED")} className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">Deny</button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
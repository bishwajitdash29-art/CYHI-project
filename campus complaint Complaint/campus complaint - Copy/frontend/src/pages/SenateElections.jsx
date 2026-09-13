
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Vote, ArrowLeft, Plus, CheckCircle, Lock, ShieldAlert, BarChart } from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function SenateElections() {
  const [elections, setElections] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const [newTitle, setNewTitle] = useState("");
  const [newCandidateName, setNewCandidateName] = useState("");
  const [newCandidateManifesto, setNewCandidateManifesto] = useState("");
  const [selectedElection, setSelectedElection] = useState(null);
  
  const [voterIdsText, setVoterIdsText] = useState("");
  const [voterMessage, setVoterMessage] = useState("");

  const [receipts, setReceipts] = useState(JSON.parse(localStorage.getItem("vote_receipts") || "{}"));

  useEffect(() => {
    fetchElections();
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const res = await axios.get(API_URL + "/api/auth/me", { headers: getHeaders() });
      if (res.data.role === "ADMIN" || res.data.username === "director@iiitdmj.ac.in") {
        setIsAdmin(true);
      }
    } catch (err) {
      console.error("Failed to verify user identity");
    }
  };

  const getHeaders = () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchElections = async () => {
    try {
      const res = await axios.get(API_URL + "/api/elections", { headers: getHeaders() });
      setElections(res.data);
      if (selectedElection) {
         const updated = res.data.find(e => e.id === selectedElection.id);
         if (updated) setSelectedElection(updated);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createElection = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL + "/api/elections", { title: newTitle }, { headers: getHeaders() });
      setNewTitle("");
      fetchElections();
    } catch (err) {
      alert("Error creating election");
    }
  };

  const addCandidate = async (e, electionId) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/elections/${electionId}/candidates`, {
        name: newCandidateName,
        manifesto: newCandidateManifesto
      }, { headers: getHeaders() });
      setNewCandidateName("");
      setNewCandidateManifesto("");
      fetchElections();
    } catch (err) {
      alert("Error adding candidate");
    }
  };

  const addVoters = async (e, electionId) => {
    e.preventDefault();
    try {
      const studentIds = voterIdsText.split("\n").map(s => s.trim()).filter(s => s);
      const res = await axios.post(`${API_URL}/api/elections/${electionId}/voters`, { studentIds }, { headers: getHeaders() });
      setVoterMessage(res.data.message);
      setVoterIdsText("");
      setTimeout(() => setVoterMessage(""), 3000);
    } catch (err) {
      alert("Error adding voters");
    }
  };

  const updateStatus = async (electionId, status) => {
    try {
      await axios.put(`${API_URL}/api/elections/${electionId}/status`, { status }, { headers: getHeaders() });
      fetchElections();
    } catch (err) {
      alert("Error updating status");
    }
  };

  const castVote = async (electionId, candidateId) => {
    if (!window.confirm("Are you sure? You cannot change your vote after submitting.")) return;
    try {
      const res = await axios.post(`${API_URL}/api/elections/${electionId}/vote`, { candidateId }, { headers: getHeaders() });
      alert(res.data.message);
      
      const newReceipts = { ...receipts, [electionId]: res.data.receipt };
      setReceipts(newReceipts);
      localStorage.setItem("vote_receipts", JSON.stringify(newReceipts));
      
      fetchElections();
    } catch (err) {
      alert(err.response?.data?.error || "Error voting");
    }
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <Link to="/" className="inline-flex items-center text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white mb-6 font-medium">
        <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
      </Link>

      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Senate Elections</h1>
          <p className="text-gray-600 dark:text-gray-400">Anonymous cryptographic voting system.</p>
        </div>
        {isAdmin && (
          <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-4 py-2 rounded-xl font-bold flex items-center">
            <ShieldAlert size={18} className="mr-2" /> Admin Mode
          </div>
        )}
      </div>

      {isAdmin && (
        <div className="linear-card p-6 mb-10 border border-indigo-200 dark:border-indigo-500/30">
          <h2 className="text-xl font-bold mb-4 dark:text-white">Create New Election</h2>
          <form onSubmit={createElection} className="flex gap-4">
            <input 
              type="text" 
              placeholder="e.g. 2026 Student Senate Elections" 
              className="linear-input flex-1"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
            />
            <button type="submit" className="linear-primary-button">Create</button>
          </form>
        </div>
      )}

      <div className="space-y-8">
        {elections.map(election => (
          <div key={election.id} className="linear-card p-6 md:p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold dark:text-white text-gray-900">{election.title}</h2>
                <div className="flex gap-3 mt-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    election.status === "ACTIVE" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                    election.status === "UPCOMING" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                    "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                  }`}>
                    {election.status}
                  </span>
                  <span className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400">
                    <Lock size={12} className="mr-1" /> Anonymous ZK-Vote
                  </span>
                </div>
              </div>
              
              {isAdmin && (
                <div className="flex gap-2">
                  {election.status === "UPCOMING" && <button onClick={() => updateStatus(election.id, "ACTIVE")} className="linear-button text-green-600">Start Election</button>}
                  {election.status === "ACTIVE" && <button onClick={() => updateStatus(election.id, "CLOSED")} className="linear-button text-red-600">Close Election</button>}
                </div>
              )}
            </div>

            {/* Admin Controls */}
            {isAdmin && (
              <div className="mb-8 grid md:grid-cols-2 gap-6 bg-gray-50 dark:bg-black/20 p-6 rounded-2xl border border-gray-100 dark:border-white/5">
                <div>
                  <h3 className="font-bold mb-3 dark:text-white text-sm">Add Candidate</h3>
                  <form onSubmit={(e) => addCandidate(e, election.id)} className="space-y-3">
                    <input type="text" placeholder="Candidate Name" className="linear-input py-2 px-3 text-sm" value={newCandidateName} onChange={e => setNewCandidateName(e.target.value)} required />
                    <textarea placeholder="Manifesto/Promises" className="linear-input py-2 px-3 text-sm h-20" value={newCandidateManifesto} onChange={e => setNewCandidateManifesto(e.target.value)} required></textarea>
                    <button type="submit" className="linear-primary-button w-full py-2 text-sm">Add</button>
                  </form>
                </div>
                <div>
                  <h3 className="font-bold mb-3 dark:text-white text-sm">Add Eligible Voters (CPI &gt; 6.5)</h3>
                  <form onSubmit={(e) => addVoters(e, election.id)} className="space-y-3">
                    <textarea placeholder="Paste Roll Numbers (one per line) e.g. 25bcs092" className="linear-input py-2 px-3 text-sm h-[124px]" value={voterIdsText} onChange={e => setVoterIdsText(e.target.value)} required></textarea>
                    <button type="submit" className="linear-primary-button w-full py-2 text-sm">Grant Eligibility</button>
                    {voterMessage && <p className="text-green-600 text-xs font-bold">{voterMessage}</p>}
                  </form>
                </div>
              </div>
            )}

            {/* Receipts */}
            {receipts[election.id] && (
              <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 p-4 rounded-xl mb-8 flex items-center justify-between">
                <div>
                  <p className="text-emerald-800 dark:text-emerald-400 font-bold flex items-center">
                    <CheckCircle size={18} className="mr-2" /> Vote Recorded Successfully
                  </p>
                  <p className="text-sm text-emerald-600 dark:text-emerald-500 mt-1 font-mono">Receipt: {receipts[election.id]}</p>
                </div>
              </div>
            )}

            {/* Candidates List */}
            <div className="grid md:grid-cols-2 gap-4">
              {election.candidates.map(candidate => (
                <div key={candidate.id} className="border border-gray-100 dark:border-white/10 rounded-2xl p-5 bg-white dark:bg-[#1a2024] flex flex-col">
                  <h3 className="text-lg font-bold dark:text-white mb-2">{candidate.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex-1 mb-6 italic">"{candidate.manifesto}"</p>
                  
                  <div className="flex justify-between items-end">
                    {(isAdmin || election.status === "CLOSED" || receipts[election.id]) ? (
                       <div className="flex items-center text-indigo-600 dark:text-indigo-400 font-bold">
                         <BarChart size={18} className="mr-2" />
                         {candidate.votesCount} Votes
                       </div>
                    ) : (
                       <div></div>
                    )}

                    {!isAdmin && election.status === "ACTIVE" && !receipts[election.id] && (
                      <button onClick={() => castVote(election.id, candidate.id)} className="linear-primary-button py-2 px-6 shadow-sm">
                        Vote
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {election.candidates.length === 0 && <p className="text-gray-500 dark:text-gray-400 text-sm">No candidates added yet.</p>}
            </div>
          </div>
        ))}
        {elections.length === 0 && <p className="text-center text-gray-500">No elections found.</p>}
      </div>
    </div>
  );
}


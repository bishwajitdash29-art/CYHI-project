import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { GraduationCap, Utensils, Users, Briefcase, User, ArrowLeft } from 'lucide-react';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function SubmitComplaint() {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState(1);
  const [targetRole, setTargetRole] = useState('');
  const [targetId, setTargetId] = useState('');
  const [targets, setTargets] = useState([]);
  const [trackingToken, setTrackingToken] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (targetRole) {
      axios.get(`${API_URL}/api/complaints/targets?role=${targetRole}`)
        .then(res => setTargets(res.data))
        .catch(err => console.error(err));
    }
  }, [targetRole]);

  const handleCategorySelect = (role) => {
    setTargetRole(role);
    setTargetId('');
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const headers = {};
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await axios.post(API_URL + '/api/complaints', {
        title,
        description,
        targetId
      }, { headers });
      
      const newToken = res.data.trackingToken;
      setTrackingToken(newToken);
      
      // Zero-Knowledge Proof: Save token locally so the student can track their complaints without DB linking
      try {
        const existing = JSON.parse(localStorage.getItem('my_complaints') || '[]');
        existing.push(newToken);
        localStorage.setItem('my_complaints', JSON.stringify(existing));
      } catch (e) {
        console.error("Could not save to local storage", e);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    }
    setLoading(false);
  };

  if (trackingToken) {
    return (
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 border dark:border-gray-700 rounded-lg shadow-sm text-center mt-10">
        <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">Complaint Submitted Successfully!</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">Please save your tracking token to check updates from the committee or accused.</p>
        <div className="bg-gray-100 dark:bg-gray-700 dark:text-white p-4 rounded text-xl font-mono mb-6 select-all border dark:border-gray-600">
          {trackingToken}
        </div>
        <Link to={`/track?token=${trackingToken}`} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Track it now
        </Link>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="max-w-3xl mx-auto mt-10">
        <h2 className="text-3xl font-bold mb-8 text-center dark:text-white">Who would you like to complain to/about?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <button onClick={() => handleCategorySelect('PROFESSOR')} className="flex flex-col items-center bg-white dark:bg-gray-800 p-8 rounded-xl border dark:border-gray-700 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 transition">
            <GraduationCap size={48} className="text-blue-600 dark:text-blue-400 mb-4" />
            <span className="font-bold text-lg text-gray-800 dark:text-gray-200">Professor</span>
          </button>
          
          <button onClick={() => handleCategorySelect('MESS')} className="flex flex-col items-center bg-white dark:bg-gray-800 p-8 rounded-xl border dark:border-gray-700 shadow-sm hover:shadow-md hover:border-orange-300 dark:hover:border-orange-500 transition">
            <Utensils size={48} className="text-orange-500 dark:text-orange-400 mb-4" />
            <span className="font-bold text-lg text-gray-800 dark:text-gray-200">Mess / Dining</span>
          </button>

          <button onClick={() => handleCategorySelect('SAC')} className="flex flex-col items-center bg-white dark:bg-gray-800 p-8 rounded-xl border dark:border-gray-700 shadow-sm hover:shadow-md hover:border-purple-300 dark:hover:border-purple-500 transition">
            <Users size={48} className="text-purple-600 dark:text-purple-400 mb-4" />
            <span className="font-bold text-lg text-gray-800 dark:text-gray-200 text-center">Student Activity Center (SAC)</span>
          </button>

          <button onClick={() => handleCategorySelect('FIC')} className="flex flex-col items-center bg-white dark:bg-gray-800 p-8 rounded-xl border dark:border-gray-700 shadow-sm hover:shadow-md hover:border-green-300 dark:hover:border-green-500 transition">
            <Briefcase size={48} className="text-green-600 dark:text-green-400 mb-4" />
            <span className="font-bold text-lg text-gray-800 dark:text-gray-200">Faculty In Charge</span>
          </button>

          <button onClick={() => handleCategorySelect('STUDENT')} className="flex flex-col items-center bg-white dark:bg-gray-800 p-8 rounded-xl border dark:border-gray-700 shadow-sm hover:shadow-md hover:border-red-300 dark:hover:border-red-500 transition md:col-span-2 lg:col-span-1">
            <User size={48} className="text-red-500 dark:text-red-400 mb-4" />
            <span className="font-bold text-lg text-gray-800 dark:text-gray-200">Another Student</span>
          </button>
        </div>
      </div>
    );
  }

  const roleNames = {
    'PROFESSOR': 'Professor',
    'MESS': 'Mess Authority',
    'SAC': 'SAC Representative',
    'FIC': 'Faculty In Charge',
    'STUDENT': 'Student'
  };

  return (
    <div className="max-w-2xl mx-auto linear-card p-10 mt-10">
      <button onClick={() => setStep(1)} className="flex items-center text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 mb-6 transition font-medium text-sm">
        <ArrowLeft size={16} className="mr-2" /> Back to Categories
      </button>
      
      <h2 className="text-3xl font-bold mb-8 dark:text-white text-gray-900">Submit to {roleNames[targetRole]}</h2>
      
      {error && <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-3 rounded mb-6 text-sm border border-red-200 dark:border-red-800/50">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select specific {roleNames[targetRole]}</label>
          <select 
            className="linear-input"
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            required
          >
            <option value="">-- Select from list --</option>
            {targets.map(t => (
              <option key={t.id} value={t.id}>{t.name} {t.role === 'STUDENT' ? `(${t.username})` : ''}</option>
            ))}
          </select>
          {targets.length === 0 && (
            <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">No registered users found in this category.</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
          <input 
            type="text" 
            required 
            className="linear-input" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Brief summary of the issue..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
          <textarea 
            required 
            className="linear-input min-h-[150px] resize-none" 
            rows="5"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed description..."
          ></textarea>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Urgency Level</label>
            <span className="text-xs font-bold text-purple-500 bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-full">
              {urgency === 1 ? 'Low' : urgency === 2 ? 'Medium' : 'High'}
            </span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="3" 
            value={urgency}
            onChange={(e) => setUrgency(parseInt(e.target.value))}
            className="neumorph-slider"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="linear-primary-button w-full py-3 mt-6 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Anonymously'}
        </button>
      </form>
    </div>
  );
}

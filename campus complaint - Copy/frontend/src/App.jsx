import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SubmitComplaint from './pages/SubmitComplaint';
import TrackComplaint from './pages/TrackComplaint';
import Login from './pages/Login';
import ProfessorDashboard from './pages/ProfessorDashboard';
import CommitteeDashboard from './pages/CommitteeDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white shadow-sm py-4 px-6 mb-8">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">Campus Feedback</h1>
            <nav className="flex gap-4">
              <Link to="/" className="text-blue-600 hover:underline">Home</Link>
              <Link to="/login" className="text-blue-600 hover:underline">Staff Login</Link>
            </nav>
          </div>
        </header>
        <main className="flex-1 max-w-4xl w-full mx-auto px-6 pb-12">
          <Routes>
            <Route path="/" element={
              <div className="text-center mt-10">
                <h2 className="text-3xl font-bold mb-4">Submit Anonymous Feedback</h2>
                <p className="mb-8 text-gray-600 text-lg">Have an issue with a professor? Let the committee know completely anonymously.</p>
                <div className="flex gap-4 justify-center">
                  <Link to="/submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 shadow">Submit a Complaint</Link>
                  <Link to="/track" className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 shadow-sm">Track Existing</Link>
                </div>
              </div>
            } />
            <Route path="/submit" element={<SubmitComplaint />} />
            <Route path="/track" element={<TrackComplaint />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard/professor" element={<ProfessorDashboard />} />
            <Route path="/dashboard/committee" element={<CommitteeDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { NewIssue } from './pages/NewIssue';
import { IssueDetail } from './pages/IssueDetail';
import { TaskDetail } from './pages/TaskDetail';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/new" element={<NewIssue />} />
            <Route path="/issues/:id" element={<IssueDetail />} />
            <Route path="/tasks/:taskId" element={<TaskDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

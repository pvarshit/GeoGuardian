import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Explorer from './pages/Explorer';
import About from './pages/About';
import SensorDetail from './pages/SensorDetail';
import ReportIssue from './pages/ReportIssue';
import GlobalMap from './pages/GlobalMap';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/map" element={<GlobalMap />} />
      <Route path="/explorer" element={<Explorer />} />
      <Route path="/about" element={<About />} />
      <Route path="/sensors/:id" element={<SensorDetail />} />
      <Route path="/report" element={<ReportIssue />} />
    </Routes>
  );
}

export default App;

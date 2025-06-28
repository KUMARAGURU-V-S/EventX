import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './components/Login';
import OrganizerDashboard from "./components/OrganizerDashboard";
import StudentDashboard from './components/StudentDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/organiser-dashboard" element={<OrganizerDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './components/Login';
import OrganizerDashboard from "./components/OrganizerDashboard";
import StudentDashboard from './components/StudentDashboard';
import OrganizerProfile from './components/OrganizerProfile';

function App() {
  return (
    <>
      <OrganizerProfile />
      <StudentDashboard />
      <OrganizerDashboard />
      
    </>
  );
}

export default App;

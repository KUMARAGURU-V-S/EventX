import Login from './components/Login';
import OrganizerDashboard from "./components/OrganizerDashboard"
import Signup from './components/Signup';
import StudentDashboard from './components/StudentDashboard';
import OrganizerProfile from './components/OrganizerProfile';

function App() {
  return (
    <>
      <Login />
      <OrganizerProfile />
      <OrganizerDashboard />
      <StudentDashboard />
      <Signup />
    </>
  );
}

export default App;

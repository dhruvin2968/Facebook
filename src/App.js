import './App.css';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/Login';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/Register";
import StartPage from './pages/Start';
import ProfilePage from './pages/Profile';

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing page */}
        <Route path="/home" element={<LandingPage />} />
        {/* Auth pages */}
         <Route path="/" element={<StartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;


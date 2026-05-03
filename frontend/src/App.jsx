import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-main">
        <Routes>
          <Route path="/" element={<LandingPage onGetStarted={() => {}} />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
          
          {/* Placeholder for Dashboard */}
          <Route path="/dashboard" element={
            <div className="placeholder-dashboard">
              <h1>Dashboard Layer Initializing...</h1>
              <p>Multi-Agent Handshake in progress.</p>
              <a href="/" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block', marginTop: '20px' }}>
                Return to Surface
              </a>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

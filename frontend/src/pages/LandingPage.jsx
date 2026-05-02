import React from 'react';
import './LandingPage.css';

const LandingPage = ({ onGetStarted }) => {
  return (
    <div className="landing-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h1 style={{ fontSize: '4rem', color: 'white' }}>NLPCortexSQL</h1>
      <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>Rebuilding UI Layer...</p>
      <button 
        onClick={onGetStarted}
        style={{ padding: '1rem 2rem', background: 'white', color: 'black', borderRadius: '8px', border: 'none', fontWeight: 'bold' }}
      >
        Enter Dashboard
      </button>
    </div>
  );
};

export default LandingPage;

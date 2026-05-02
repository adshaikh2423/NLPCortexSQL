import React, { useState } from 'react'
import LandingPage from './pages/LandingPage'
import './index.css'

function App() {
  const [isStarted, setIsStarted] = useState(false);

  return (
    <div className="app-main">
      {!isStarted ? (
        <LandingPage onGetStarted={() => setIsStarted(true)} />
      ) : (
        <div className="placeholder-dashboard">
          <h1>Dashboard Layer Initializing...</h1>
          <p>Multi-Agent Handshake in progress.</p>
          <button className="btn-primary" onClick={() => setIsStarted(false)}>
            Return to Surface
          </button>
        </div>
      )}
    </div>
  )
}

export default App

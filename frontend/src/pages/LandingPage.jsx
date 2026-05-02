import React from 'react';
import { motion } from 'framer-motion';
import { Database, Zap, Shield, ArrowRight, Github } from 'lucide-react';
import SoftAurora from '../components/SoftAurora/SoftAurora';
import './LandingPage.css';

const LandingPage = ({ onGetStarted }) => {
  return (
    <div className="landing-container">
      {/* Background Effect */}
      <SoftAurora
        speed={0.6}
        scale={1.5}
        brightness={1}
        color1="#f7f7f7"
        color2="#e100ff"
        noiseFrequency={2.5}
        noiseAmplitude={1}
        bandHeight={0.5}
        bandSpread={1}
        octaveDecay={0.1}
        layerOffset={0}
        colorSpeed={1}
        enableMouseInteraction
        mouseInfluence={0.25}
      />

      <nav className="glass-nav">
        <div className="nav-logo">
          <Database className="logo-icon" />
          <span>NLPCortexSQL</span>
        </div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#architecture">Architecture</a>
          <button className="btn-secondary">Documentation</button>
        </div>
      </nav>

      <main className="hero-section">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="badge"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            Autonomous Data Intelligence
          </motion.div>
          
          <h1 className="hero-title">
            Talk to Your Data <br />
            <span>As If It Were Human</span>
          </h1>
          
          <p className="hero-subtitle">
            Transform complex PostgreSQL schemas into conversational insights using 
            multi-agent orchestration and hybrid intelligence models.
          </p>

          <div className="hero-actions">
            <button className="btn-primary" onClick={onGetStarted}>
              Get Started <ArrowRight className="btn-icon" />
            </button>
            <button className="btn-glass">
              <Github className="btn-icon" /> GitHub
            </button>
          </div>
        </motion.div>

        <motion.div 
          className="hero-visual"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <div className="glass-card main-card">
            <div className="card-header">
              <div className="dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <div className="status">AI AGENT: IDLE</div>
            </div>
            <div className="card-body">
              <div className="chat-msg user">"Analyze revenue trends for last quarter"</div>
              <div className="chat-msg ai">
                <span className="typing">Thinking...</span>
                <div className="code-block">
                  SELECT category, SUM(amount) FROM orders <br />
                  WHERE created_at >= '2024-01-01' <br />
                  GROUP BY category;
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <section id="features" className="features-grid">
        <FeatureCard 
          icon={<Zap />} 
          title="Multi-Agent Reasoning" 
          desc="5 specialized agents working in sync to plan, reflect, and execute."
        />
        <FeatureCard 
          icon={<Shield />} 
          title="Self-Healing Loop" 
          desc="Autonomous error recovery from database tracebacks without user input."
        />
        <FeatureCard 
          icon={<Database />} 
          title="Semantic Knowledge" 
          desc="Instant schema mapping from CSV/Excel into the AI's neural memory."
        />
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <motion.div 
    className="glass-card feature-card"
    whileHover={{ y: -10, transition: { duration: 0.2 } }}
  >
    <div className="feature-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{desc}</p>
  </motion.div>
);

export default LandingPage;

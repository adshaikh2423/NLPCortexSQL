import { useState } from 'react';
import { motion } from 'framer-motion';
import SoftAurora from '../components/SoftAurora/SoftAurora';
import ScrollStack, { ScrollStackItem } from '../components/ScrollStack/ScrollStack';
import './LandingPage.css';

const STACK_CARDS = [
  {
    emoji: '⚡',
    title: 'Multi-Agent Reasoning',
    desc: '5 specialized agents — Supervisor, Reasoner, SQL Agent, Reflector & Formatter — working in perfect sync to process every query autonomously.',
    color: '#e100ff',
  },
  {
    emoji: '🛡️',
    title: 'Self-Healing Loop',
    desc: 'When an error occurs, the Reflector agent reads the traceback, corrects the SQL, and re-executes — all without any user intervention.',
    color: '#7f00ff',
  },
  {
    emoji: '🧠',
    title: 'Semantic Schema Memory',
    desc: 'Upload any CSV or Excel file and the system instantly maps the schema into the AI\'s working memory, making it immediately queryable.',
    color: '#b8b8ff',
  },
  {
    emoji: '🔒',
    title: 'Secure Execution Layer',
    desc: 'Every SQL query is validated against the user\'s registered schema before execution, preventing unauthorized access to any data.',
    color: '#cf6fff',
  },
];

export default function LandingPage({ onGetStarted }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="lp-root">
      {/* Aurora Background */}
      <div className="lp-aurora">
        <SoftAurora
          speed={0.6}
          scale={1.5}
          brightness={1.2}
          color1="#b8b8ff"
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
      </div>

      {/* Noise Overlay */}
      <div className="lp-noise" />

      {/* Nav */}
      <nav className="lp-nav">
        <div className="lp-nav-brand">
          <span className="lp-nav-dot" />
          NLPCortexSQL
        </div>
        <div className="lp-nav-links">
          <a href="#features" className="lp-nav-link">Features</a>
          <a href="#architecture" className="lp-nav-link">Architecture</a>
          <a href="#docs" className="lp-nav-link">Docs</a>
          <button className="lp-btn-outline" onClick={onGetStarted}>Launch App →</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="lp-hero">
        <motion.div
          className="lp-hero-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        >
          <motion.span
            className="lp-badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            ✦ Autonomous Data Intelligence
          </motion.span>

          <h1 className="lp-hero-title">
            Talk to Your Data<br />
            <span className="lp-hero-gradient">Like It&apos;s Human</span>
          </h1>

          <p className="lp-hero-sub">
            Transform complex PostgreSQL schemas into conversational insights
            using a 5-agent LangGraph pipeline and hybrid Gemini intelligence.
          </p>

          <div className="lp-hero-actions">
            <motion.button
              className="lp-btn-primary"
              onClick={onGetStarted}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Get Started
              <span className="lp-btn-arrow">→</span>
            </motion.button>
            <motion.a
              href="https://github.com/adshaikh2423/NLPCortexSQL"
              target="_blank"
              rel="noreferrer"
              className="lp-btn-ghost"
              whileHover={{ scale: 1.04 }}
            >
              ⭐ GitHub
            </motion.a>
          </div>
        </motion.div>

        {/* Terminal Card */}
        <motion.div
          className="lp-hero-card"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <div className="lp-card-header">
            <span className="lp-dot lp-dot-r" />
            <span className="lp-dot lp-dot-y" />
            <span className="lp-dot lp-dot-g" />
            <span className="lp-card-title">cortex-agent · live</span>
          </div>
          <div className="lp-card-body">
            <p className="lp-card-query">&gt; &quot;Show top 5 products by revenue this quarter&quot;</p>
            <div className="lp-card-steps">
              <p className="lp-step done">✓ Supervisor: Task delegated</p>
              <p className="lp-step done">✓ Reasoner: Schema analyzed</p>
              <p className="lp-step done">✓ SQL Agent: Query generated</p>
              <p className="lp-step active">⟳ Executor: Running...</p>
            </div>
            <pre className="lp-card-code">{`SELECT p.name, SUM(o.amount) AS revenue
FROM orders o
JOIN products p ON o.product_id = p.id
WHERE o.created_at >= '2024-01-01'
GROUP BY p.name
ORDER BY revenue DESC
LIMIT 5;`}</pre>
          </div>
        </motion.div>
      </section>

      {/* Scroll Stack Features Section */}
      <section id="features" className="lp-stack-section">
        <div className="lp-stack-wrapper">
          <ScrollStack
            itemDistance={150}
            itemScale={0.04}
            itemStackDistance={30}
            stackPosition="15%"
            scaleEndPosition="5%"
            baseScale={0.9}
            blurAmount={0}
            useWindowScroll
            {STACK_CARDS.map((card, i) => (
              <ScrollStackItem key={card.title}>
                <div
                  className="lp-stack-card-inner"
                  style={{ '--card-color': card.color }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div className="lp-stack-card-icon">{card.emoji}</div>
                  <div>
                    <h3 className="lp-stack-card-title">{card.title}</h3>
                    <p className="lp-stack-card-desc">{card.desc}</p>
                  </div>
                  <div className="lp-stack-card-index">0{i + 1}</div>
                </div>
              </ScrollStackItem>
            ))}
          </ScrollStack>
        </div>
      </section>

      {/* Footer */}
      <footer className="lp-footer">
        <p>© 2025 NLPCortexSQL · Built with FastAPI, LangGraph &amp; React</p>
      </footer>
    </div>
  );
}

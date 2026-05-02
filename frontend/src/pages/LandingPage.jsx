import { useState } from 'react'
import { motion } from 'framer-motion'
import SoftAurora from '../components/SoftAurora/SoftAurora'
import './LandingPage.css'

const NAV_LINKS = ['Features', 'Architecture', 'Docs']

const FEATURES = [
  {
    icon: '⚡',
    title: 'Multi-Agent Reasoning',
    desc: '5 specialized agents working in sync to plan, reflect, and execute SQL queries autonomously.',
  },
  {
    icon: '🛡️',
    title: 'Self-Healing Loop',
    desc: 'Autonomous error recovery from database tracebacks with zero user intervention.',
  },
  {
    icon: '🧠',
    title: 'Semantic Knowledge',
    desc: 'Instant schema mapping from CSV/Excel directly into the AI neural memory.',
  },
]

export default function LandingPage({ onGetStarted }) {
  const [hovered, setHovered] = useState(null)

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
          {NAV_LINKS.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} className="lp-nav-link">{l}</a>
          ))}
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
            <span className="lp-hero-gradient">Like It's Human</span>
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
            <p className="lp-card-query">&gt; &quot;Show me top 5 products by revenue this quarter&quot;</p>
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

      {/* Features */}
      <section id="features" className="lp-features">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            className={`lp-feature-card ${hovered === i ? 'lp-feature-card--active' : ''}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="lp-feature-icon">{f.icon}</div>
            <h3 className="lp-feature-title">{f.title}</h3>
            <p className="lp-feature-desc">{f.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Footer */}
      <footer className="lp-footer">
        <p>© 2025 NLPCortexSQL · Built with FastAPI, LangGraph & React</p>
      </footer>
    </div>
  )
}

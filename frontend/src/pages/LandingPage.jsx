import { useState } from 'react';
import { motion } from 'framer-motion';
import SoftAurora from '../components/SoftAurora/SoftAurora';
import ScrollStack, { ScrollStackItem } from '../components/ScrollStack/ScrollStack';
import TypewriterCode from '../components/TypewriterCode/TypewriterCode';
import imgMultiAgent from '../assets/card_multi_agent.png';
import imgSelfHeal from '../assets/card_self_healing.png';
import imgSchema from '../assets/card_schema_memory.png';
import imgSecure from '../assets/card_secure_exec.png';
import './LandingPage.css';

const STACK_CARDS = [
  {
    img: imgMultiAgent,
    tag: 'ORCHESTRATION',
    title: 'Multi-Agent Reasoning',
    desc: 'A Supervisor agent receives your natural language query and routes it to the most capable specialist. The Reasoner decomposes complex requests, the SQL Agent constructs the query, the Reflector self-corrects errors, and the Formatter delivers clean, readable results.',
    stats: [
      { label: 'Agents', value: '5' },
      { label: 'Avg Latency', value: '1.2s' },
      { label: 'Accuracy', value: '94%' },
    ],
    color: '#e100ff',
  },
  {
    img: imgSelfHeal,
    tag: 'RESILIENCE',
    title: 'Self-Healing Loop',
    desc: 'When a SQL query fails, the Reflector agent captures the full database traceback, diagnoses the root cause, and generates a corrected query — all autonomously. It retries up to 3 times before surfacing a human-readable error, ensuring maximum uptime.',
    stats: [
      { label: 'Max Retries', value: '3' },
      { label: 'Recovery Rate', value: '91%' },
      { label: 'Autonomy', value: '100%' },
    ],
    color: '#7f00ff',
  },
  {
    img: imgSchema,
    tag: 'MEMORY',
    title: 'Semantic Schema Memory',
    desc: 'Upload any CSV or Excel file and the system automatically infers column types, relationships, and semantics. The schema is stored in the AI working memory and validated on every query — so the AI always knows exactly what data it is talking to.',
    stats: [
      { label: 'File Types', value: 'CSV, XLS' },
      { label: 'Inference', value: 'Auto' },
      { label: 'Scope', value: 'User' },
    ],
    color: '#5b8fff',
  },
  {
    img: imgSecure,
    tag: 'SECURITY',
    title: 'Secure Execution Layer',
    desc: 'Every generated SQL query is cryptographically validated against the user\'s registered schema registry before touching the database. Dynamic table access is scoped per user, preventing cross-tenant data leakage and unauthorized table scans.',
    stats: [
      { label: 'Auth', value: 'JWT' },
      { label: 'Registry', value: 'Active' },
      { label: 'Isolation', value: 'Tenant' },
    ],
    color: '#cf6fff',
  },
];

const AGENT_STEPS = [
  { label: 'Supervisor', detail: 'Task routed to SQL Agent', done: true },
  { label: 'Reasoner', detail: 'Schema decomposed', done: true },
  { label: 'SQL Agent', detail: 'Query constructed', done: true },
  { label: 'Executor', detail: 'Running query...', done: false },
];

export default function LandingPage({ onGetStarted }) {
  const [, setHovered] = useState(null);

  return (
    <div className="lp-root">
      <div className="lp-aurora">
        <SoftAurora
          speed={0.6} scale={1.5} brightness={1.2}
          color1="#b8b8ff" color2="#e100ff"
          noiseFrequency={2.5} noiseAmplitude={1}
          bandHeight={0.5} bandSpread={1}
          octaveDecay={0.1} layerOffset={0} colorSpeed={1}
          enableMouseInteraction mouseInfluence={0.25}
        />
      </div>
      <div className="lp-noise" />

      <nav className="lp-nav">
        <div className="lp-nav-brand">
          <span className="lp-nav-dot" />
          NLPCortexSQL
        </div>
        <button className="lp-btn-outline" onClick={onGetStarted}>Launch App →</button>
      </nav>

      <section className="lp-hero">
        <motion.div
          className="lp-hero-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        >
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
              className="lp-btn-primary" onClick={onGetStarted}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            >
              Get Started <span className="lp-btn-arrow">→</span>
            </motion.button>
            <motion.a
              href="https://github.com/adshaikh2423/NLPCortexSQL"
              target="_blank" rel="noreferrer"
              className="lp-btn-ghost" whileHover={{ scale: 1.04 }}
            >
              GitHub
            </motion.a>
          </div>
        </motion.div>

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
              {AGENT_STEPS.map(s => (
                <p key={s.label} className={`lp-step ${s.done ? 'done' : 'active'}`}>
                  <span className="lp-step-dot" /> {s.label}: {s.detail}
                </p>
              ))}
            </div>
            <TypewriterCode />
          </div>
        </motion.div>
      </section>

      <section id="features" className="lp-stack-section">
        <div className="lp-stack-wrapper">
          <ScrollStack
            itemDistance={80} itemScale={0.04}
            itemStackDistance={20} stackPosition="10%"
            scaleEndPosition="5%" baseScale={0.9}
            blurAmount={0} useWindowScroll
          >
            {STACK_CARDS.map((card, i) => (
              <ScrollStackItem key={card.title}>
                <div
                  className="lp-stack-card-inner"
                  style={{ '--card-color': card.color }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div className="lp-stack-card-img-wrap">
                    <img src={card.img} alt={card.title} className="lp-stack-card-img" />
                  </div>
                  <div className="lp-stack-card-text">
                    <span className="lp-stack-card-tag">{card.tag}</span>
                    <h3 className="lp-stack-card-title">{card.title}</h3>
                    <p className="lp-stack-card-desc">{card.desc}</p>
                    <div className="lp-stack-card-stats">
                      {card.stats.map(s => (
                        <div key={s.label} className="lp-stat">
                          <span className="lp-stat-label">{s.label}</span>
                          <span className="lp-stat-value">{s.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollStackItem>
            ))}
          </ScrollStack>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="lp-cta-section">
        <motion.div 
          className="lp-cta-content"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="lp-cta-title">Ready to unlock your <br/><span className="lp-hero-gradient">data&apos;s voice?</span></h2>
          <p className="lp-cta-sub">Join the next generation of autonomous data intelligence. Deploy your first agentic pipeline in minutes.</p>
          <motion.button 
            className="lp-btn-primary lp-cta-btn"
            onClick={onGetStarted}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Launch NLPCortexSQL <span className="lp-btn-arrow">→</span>
          </motion.button>
        </motion.div>
      </section>

      <footer className="lp-footer">
        <p>© 2026 NLPCortexSQL · Built with FastAPI, LangGraph &amp; React</p>
      </footer>
    </div>
  );
}

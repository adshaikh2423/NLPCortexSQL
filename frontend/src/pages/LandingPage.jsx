import { useState } from 'react';
import { motion } from 'motion/react';
import ShinyText from '../components/ShinyText/ShinyText';
import SoftAurora from '../components/SoftAurora/SoftAurora';
import ScrollStack, { ScrollStackItem } from '../components/ScrollStack/ScrollStack';
import TypewriterCode from '../components/TypewriterCode/TypewriterCode';
import imgMultiAgent from '../assets/card_multi_agent.png';
import imgSelfHeal from '../assets/card_self_healing.png';
import imgSchema from '../assets/card_schema_memory.png';
import imgSecure from '../assets/card_secure_exec.png';
import { NoiseBackground } from '../components/ui/noise-background';
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
        <NoiseBackground
          containerStyle={{ borderRadius: '9999px', padding: '2px' }}
          gradientColors={["#e100ff", "#00ff88"]}
        >
          <button
            onClick={onGetStarted}
            style={{
              padding: '0.4rem 1.4rem',
              background: '#050508',
              borderRadius: '9999px',
              color: '#fff',
              fontSize: '0.875rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontFamily: 'inherit',
            }}
          >
            Launch App →
          </button>
        </NoiseBackground>
      </nav>

      <section className="lp-hero">
        <motion.div
          className="lp-hero-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        >
          <h1 className="lp-hero-title">
            <ShinyText text="Talk to Your Data" speed={3} color="#b5b5b5" shineColor="#ffffff" /> <br />
            <ShinyText text="Like It's Human" speed={3} color="#e100ff" shineColor="#ffffff" />
          </h1>
          <p className="lp-hero-sub">
            Transform complex PostgreSQL schemas into conversational insights
            using a 5-agent LangGraph pipeline and hybrid Gemini intelligence.
          </p>
          <div className="lp-hero-actions">
            <NoiseBackground
              containerStyle={{ borderRadius: '0.75rem', padding: '2px' }}
              gradientColors={["#e100ff", "#00ff88", "#cf6fff"]}
            >
              <button
                onClick={onGetStarted}
                style={{
                  padding: '0.75rem 2rem',
                  background: '#050508',
                  borderRadius: '0.6rem',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '1rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontFamily: 'inherit',
                }}
              >
                Get Started <span className="lp-btn-arrow">→</span>
              </button>
            </NoiseBackground>
            <NoiseBackground
              containerStyle={{ borderRadius: '0.75rem', padding: '2px', display: 'inline-block' }}
              gradientColors={["#e100ff", "#00ff88", "#cf6fff"]}
            >
              <a
                href="https://github.com/adshaikh2423/NLPCortexSQL"
                target="_blank" rel="noreferrer"
                style={{
                  padding: '0.75rem 2rem',
                  background: '#050508',
                  borderRadius: '0.6rem',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '1rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontFamily: 'inherit',
                  textDecoration: 'none',
                }}
              >
                GitHub
              </a>
            </NoiseBackground>
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
            itemDistance={100} itemScale={0.04}
            itemStackDistance={25} stackPosition="12%"
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
          <h2 className="lp-cta-title">
            <ShinyText text="Ready to unlock your" speed={3} color="#ffffff" shineColor="#b5b5b5" /> <br/>
            <ShinyText text="data's voice?" speed={3} color="#e100ff" shineColor="#ffffff" />
          </h2>
          <p className="lp-cta-sub">Join the next generation of autonomous data intelligence. Deploy your first agentic pipeline in minutes.</p>
          <NoiseBackground
            containerStyle={{ borderRadius: '1rem', padding: '2px', display: 'inline-block', cursor: 'pointer' }}
            gradientColors={["#e100ff", "#00ff88", "#cf6fff"]}
          >
            <button
              onClick={onGetStarted}
              style={{
                padding: '1.1rem 3rem',
                background: '#050508',
                borderRadius: '0.85rem',
                color: '#fff',
                fontWeight: 800,
                fontSize: '1.05rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                fontFamily: 'inherit',
              }}
            >
              Launch NLPCortexSQL <span className="lp-btn-arrow">→</span>
            </button>
          </NoiseBackground>
        </motion.div>
      </section>

      <footer className="lp-footer">
        <p>© 2026 NLPCortexSQL · Built with FastAPI, LangGraph &amp; React</p>
      </footer>
    </div>
  );
}

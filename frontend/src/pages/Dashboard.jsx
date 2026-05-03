import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  Database, 
  History, 
  Settings, 
  LogOut, 
  Upload, 
  Cpu, 
  Send,
  FileSpreadsheet,
  Terminal
} from 'lucide-react';
import SoftAurora from '../components/SoftAurora/SoftAurora';
import { NoiseBackground } from '../components/ui/noise-background';
import ShinyText from '../components/ShinyText/ShinyText';
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'System online. Agents standing by. How can I help you explore your data today?', agents: [] }
  ]);
  const [input, setInput] = useState('');
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...uploadedFiles]);
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    const newMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, newMsg]);
    setInput('');

    // Mock agentic response (we will connect to real backend next)
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Analyzing your request through the 5-agent pipeline...',
        agents: ['Supervisor', 'Reasoner']
      }]);
    }, 1000);
  };

  return (
    <div className="db-container">
      {/* Immersive Background */}
      <div className="db-bg">
        <SoftAurora 
          color1="#1a1a2e" color2="#0a0a0c"
          noiseFrequency={1.5} noiseAmplitude={0.5}
          bandHeight={0.3} bandSpread={0.8}
        />
      </div>

      {/* Sidebar Navigation */}
      <aside className="db-sidebar">
        <div className="db-logo">
          <div className="db-logo-dot" />
          <span>CortexSQL</span>
        </div>

        <nav className="db-nav">
          <button 
            className={`db-nav-item ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            <MessageSquare size={20} />
            <span>Agentic Chat</span>
          </button>
          <button 
            className={`db-nav-item ${activeTab === 'data' ? 'active' : ''}`}
            onClick={() => setActiveTab('data')}
          >
            <Database size={20} />
            <span>Data Sources</span>
          </button>
          <button 
            className={`db-nav-item ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <History size={20} />
            <span>Analysis Log</span>
          </button>
        </nav>

        <div className="db-sidebar-footer">
          <button className="db-nav-item" onClick={() => setActiveTab('settings')}>
            <Settings size={20} />
            <span>Settings</span>
          </button>
          <button className="db-nav-item logout" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Exit Platform</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="db-main">
        <header className="db-header">
          <div className="db-header-left">
            <h1 className="db-title">
              <ShinyText 
                text={activeTab === 'chat' ? "Data Intelligence" : "Source Management"} 
                speed={4} color="#fff" shineColor="#cf6fff" 
              />
            </h1>
          </div>
          <div className="db-header-right">
            <div className="db-agent-status">
              <span className="status-pulse" />
              Agentic Pipeline: <span className="status-text">Operational</span>
            </div>
          </div>
        </header>

        <section className="db-stage">
          <AnimatePresence mode="wait">
            {activeTab === 'chat' ? (
              <motion.div 
                key="chat"
                className="db-chat-view"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="db-messages-container">
                  {messages.map((msg, i) => (
                    <div key={i} className={`db-message ${msg.role}`}>
                      <div className="db-message-bubble">
                        {msg.content}
                        {msg.agents && msg.agents.length > 0 && (
                          <div className="db-message-agents">
                            {msg.agents.map(a => (
                              <span key={a} className="agent-badge"><Cpu size={12}/> {a}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                <div className="db-input-area">
                  <div className="db-input-wrapper">
                    <input 
                      type="text" 
                      placeholder="Ask your data anything..." 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button className="db-send-btn" onClick={handleSendMessage}>
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="data"
                className="db-data-view"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="db-upload-grid">
                  <div className="db-upload-card">
                    <div className="upload-icon-box">
                      <FileSpreadsheet size={40} color="#e100ff" />
                    </div>
                    <h3>CSV Data Upload</h3>
                    <p>Import flat files for instant agentic analysis.</p>
                    <label className="db-upload-label">
                      <Upload size={18} />
                      Select CSV Files
                      <input type="file" accept=".csv" onChange={handleFileUpload} hidden />
                    </label>
                  </div>

                  <div className="db-upload-card">
                    <div className="upload-icon-box">
                      <Terminal size={40} color="#00ff88" />
                    </div>
                    <h3>Database Schema</h3>
                    <p>Connect your PostgreSQL or MySQL instance.</p>
                    <button className="db-secondary-btn">Connect DB</button>
                  </div>
                </div>

                {files.length > 0 && (
                  <div className="db-files-list">
                    <h4>Active Sources</h4>
                    {files.map((f, i) => (
                      <div key={i} className="db-file-item">
                        <FileSpreadsheet size={16} />
                        <span>{f.name}</span>
                        <span className="file-status">Ready</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { 
  MessageSquare, 
  Database, 
  History, 
  LogOut, 
  Upload, 
  Cpu, 
  Send,
  FileSpreadsheet,
  Trash2,
  X,
  Copy,
  Check,
  Square,
  Clock
} from 'lucide-react';
import SoftAurora from '../components/SoftAurora/SoftAurora';
import ShinyText from '../components/ShinyText/ShinyText';
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'System online. Agents standing by. How can I help you explore your data today?', agents: [], isWelcome: true }
  ]);
  const [input, setInput] = useState('');
  const [files, setFiles] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedSchema, setSelectedSchema] = useState(null);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [streamingAgent, setStreamingAgent] = useState(null);
  const [expandedMessages, setExpandedMessages] = useState(new Set());
  const [copiedSQL, setCopiedSQL] = useState(null);
  const [abortController, setAbortController] = useState(null);
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  useEffect(() => {
    fetchFiles(); // Pre-fetch for suggestions
  }, []);

  useEffect(() => {
    if (activeTab === 'history') fetchHistory();
  }, [activeTab]);

  const handleInputChange = (val) => {
    setInput(val);
    const words = val.split(' ');
    const lastWord = words[words.length - 1].toLowerCase();
    
    if (lastWord.length >= 2) {
      const matches = files.filter(f => 
        (f.name && f.name.toLowerCase().includes(lastWord)) || 
        (f.table && f.table.toLowerCase().includes(lastWord))
      ).map(f => f.name || f.table);
      setFilteredSuggestions([...new Set(matches)]);
    } else {
      setFilteredSuggestions([]);
    }
  };

  const applySuggestion = (suggestion) => {
    const words = input.split(' ');
    words[words.length - 1] = suggestion;
    setInput(words.join(' ') + ' ');
    setFilteredSuggestions([]);
  };

  const fetchFiles = async () => {
    try {
      const response = await fetch('http://localhost:8000/files', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (response.ok) setFiles(data);
    } catch (err) {
      console.error("Failed to fetch files", err);
    }
  };

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/history', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (response.ok) setHistory(data);
    } catch (err) {
      console.error("Failed to fetch history", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    const tableName = file.name.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    formData.append('table_name', tableName);
    try {
      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formData
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Upload failed");
      fetchFiles();
      alert(`Success: ${file.name} ingested.`);
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = async (tableName) => {
    if (!window.confirm(`Delete table '${tableName}'?`)) return;
    try {
      const response = await fetch(`http://localhost:8000/delete-table/${tableName}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) fetchFiles();
    } catch (err) {
      alert("Error deleting file");
    }
  };

  const toggleExpand = (index) => {
    setExpandedMessages(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const handleCopySQL = (sql, index) => {
    navigator.clipboard.writeText(sql);
    setCopiedSQL(index);
    setTimeout(() => setCopiedSQL(null), 2000);
  };

  const handleStopQuery = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
      setLoading(false);
      setStreamingAgent(null);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Query analysis terminated by user.', isError: true }]);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setStreamingAgent('INITIALIZING');

    const controller = new AbortController();
    setAbortController(controller);

    try {
      const formData = new FormData();
      formData.append('query', input);

      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formData,
        signal: controller.signal
      });

      if (!response.ok) throw new Error("Connection interrupted");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.trim().startsWith('data: ')) {
            try {
              const data = JSON.parse(line.trim().slice(6));
              
              if (data.agent) {
                setStreamingAgent(data.agent.toUpperCase());
              }
              
              if (data.done) {
                setMessages(prev => [...prev, {
                  role: 'assistant',
                  content: data.answer,
                  sql: data.sql,
                  ml_draft: data.ml_draft,
                  results: data.data[0],
                  agents: ['Supervisor', 'Reasoner', 'Reflector', 'Executor']
                }]);
                setStreamingAgent(null);
              }
            } catch (e) {
              console.error("Stream parse error", e);
            }
          }
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') return;
      setMessages(prev => [...prev, { role: 'assistant', content: `System Error: ${err.message}`, isError: true }]);
      setStreamingAgent(null);
    } finally {
      setLoading(false);
      setAbortController(null);
    }
  };

  return (
    <div className="db-container">
      <AnimatePresence>
        {selectedSchema && (
          <motion.div className="db-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedSchema(null)}>
            <motion.div className="db-modal" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Table Schema: {selectedSchema.table}</h3>
                <button onClick={() => setSelectedSchema(null)}><X size={20}/></button>
              </div>
              <div className="modal-body">
                <pre>{JSON.stringify(JSON.parse(selectedSchema.columns), null, 2)}</pre>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="db-bg">
        <SoftAurora color1="#1a1a2e" color2="#0a0a0c" noiseFrequency={1.5} noiseAmplitude={0.5} bandHeight={0.3} bandSpread={0.8} />
      </div>

      <aside className="db-sidebar">
        <div className="db-logo">
          <img src="/logo.png" alt="CortexSQL Logo" className="db-logo-img" />
          <ShinyText text="CortexSQL" speed={3} color="#ffffff" shineColor="#e100ff" />
        </div>
        <nav className="db-nav">
          <button className={`db-nav-item ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}><MessageSquare size={20} /><span>Agentic Chat</span></button>
          <button className={`db-nav-item ${activeTab === 'data' ? 'active' : ''}`} onClick={() => setActiveTab('data')}><Database size={20} /><span>Data Sources</span></button>
          <button className={`db-nav-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}><History size={20} /><span>Analysis Log</span></button>
        </nav>
        <div className="db-sidebar-footer">
          <button className="db-nav-item logout" onClick={handleLogout}><LogOut size={20} /><span>Exit Platform</span></button>
        </div>
      </aside>

      <main className="db-main">
        <header className="db-header">
          <div className="db-header-left">
            <h1 className="db-title">
              <ShinyText text={activeTab === 'chat' ? "Intelligence Engine" : activeTab === 'data' ? "Source Hub" : "Analysis History"} speed={4} color="#fff" shineColor="#cf6fff" />
            </h1>
          </div>
          <div className="db-header-right">
            <div className="db-agent-status"><span className="status-pulse" />Status: <span className="status-text">{loading ? "Processing..." : "Ready"}</span></div>
          </div>
        </header>

        <section className="db-stage">
          <AnimatePresence mode="wait">
            {activeTab === 'chat' && (
              <motion.div key="chat" className="db-chat-view" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="db-messages-container">
                  {messages.map((msg, i) => (
                    <div key={i} className={`db-message ${msg.role}`}>
                      <div className={`db-message-bubble ${msg.isError ? 'error' : ''}`}>
                        {msg.isWelcome ? (
                          <ShinyText 
                            text={msg.content} 
                            speed={4} 
                            color="#fff" 
                            shineColor="#cf6fff" 
                          />
                        ) : (
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        )}
                        {msg.sql && (
                          <div className="db-msg-sql">
                            <div className="sql-header">
                              <span>Final Verified SQL</span>
                              <button onClick={() => handleCopySQL(msg.sql, i)} className="sql-copy-btn">
                                {copiedSQL === i ? <Check size={14}/> : <Copy size={14}/>}
                                {copiedSQL === i ? "Copied!" : "Copy"}
                              </button>
                            </div>
                            <code>{msg.sql}</code>
                          </div>
                        )}
                        {msg.results && msg.results.length > 0 && (
                          <div className="db-msg-results">
                            <div className="results-header">
                              <span>Results ({msg.results.length} rows)</span>
                              {msg.results.length > 5 && (
                                <button onClick={() => toggleExpand(i)} className="expand-btn">
                                  {expandedMessages.has(i) ? "Show Less" : "View All"}
                                </button>
                              )}
                            </div>
                            <div className={`results-table-wrapper ${expandedMessages.has(i) ? 'expanded' : ''}`}>
                              <table>
                                <thead><tr>{Object.keys(msg.results[0]).map(k => <th key={k}>{k}</th>)}</tr></thead>
                                <tbody>
                                  {(expandedMessages.has(i) ? msg.results : msg.results.slice(0, 5)).map((row, ri) => (
                                    <tr key={ri}>{Object.values(row).map((val, vi) => <td key={vi}>{String(val)}</td>)}</tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                        {msg.agents && msg.agents.length > 0 && (
                          <div className="db-message-agents">
                            <span className="agent-badge ml">Cortex-ML (Lead)</span>
                            {msg.agents.map(a => <span key={a} className="agent-badge">{a}</span>)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {streamingAgent && (
                    <div className="db-message assistant streaming">
                      <div className="db-message-bubble loading">
                        <div className="streaming-trace">
                          <span className="trace-pulse" />
                          <span className="trace-text">SYSTEM ACTIVE: {streamingAgent}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={chatEndRef} />
                </div>
                <div className="db-input-area">
                  <div className="db-input-wrapper">
                    {filteredSuggestions.length > 0 && (
                      <div className="db-suggestions-box">
                        {filteredSuggestions.map((s, idx) => (
                          <div key={idx} className="db-suggestion-item" onClick={() => applySuggestion(s)}>
                            <Database size={14} />
                            <span>{s}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <input 
                      type="text" 
                      placeholder="Explore your data sources..." 
                      value={input} 
                      onChange={(e) => handleInputChange(e.target.value)} 
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} 
                    />
                    <button 
                      className={`db-send-btn ${loading ? 'loading' : ''}`} 
                      onClick={loading ? handleStopQuery : handleSendMessage}
                    >
                      {loading ? <Square size={20} fill="white" /> : <Send size={20} />}
                    </button>
                  </div>
                  <div className="db-chat-disclaimer">
                    Cortex-ML is an autonomous analytical engine; generated insights and SQL queries should be verified for critical decision-making.
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'data' && (
              <motion.div key="data" className="db-data-view" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="db-upload-grid">
                  <div className="db-upload-card">
                    <div className="upload-icon-box"><FileSpreadsheet size={40} color="#e100ff" /></div>
                    <h3>Upload Data Source</h3>
                    <label className="db-upload-label"><Upload size={18} /> Select CSV<input type="file" accept=".csv" onChange={handleFileUpload} hidden disabled={loading} /></label>
                  </div>
                </div>
                {files.length > 0 ? (
                  <div className="db-files-list">
                    <h4>Active Knowledge Base</h4>
                    <div className="db-files-grid">
                      {files.map((f, i) => (
                        <div key={i} className="db-file-card">
                          <div className="file-card-header">
                            <div className="file-card-icon"><FileSpreadsheet size={24} color="#e100ff" /></div>
                            <div className="file-card-meta"><span className="file-card-name">{f.name || "Untitled"}</span><span className="file-card-id">Table: <code>{f.table}</code></span></div>
                            <button className="file-card-delete" onClick={() => handleDeleteFile(f.table)}><Trash2 size={18} /></button>
                          </div>
                          <div className="file-card-body">
                            <div className="file-stat"><span className="stat-label">Records</span><span className="stat-value">{f.rows || 0}</span></div>
                            <div className="file-schema-preview"><span className="schema-label">Schema</span><div className="schema-tags">{f.columns && Object.keys(JSON.parse(f.columns)).map(col => <span key={col} className="schema-tag">{col}</span>)}</div></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="db-empty-state"><Database size={48} color="rgba(255,255,255,0.1)" /><p>No active sources found. Upload a CSV to begin.</p></div>
                )}
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div key="history" className="db-history-view" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="history-header"><h2>Analysis Log</h2><p>Timeline of past insights and reflections</p></div>
                {history.length > 0 ? (
                  <div className="history-timeline">
                    {history.map((log, idx) => (
                      <div key={idx} className="history-card">
                        <div className="history-card-top"><span className="history-time">{new Date(log.timestamp).toLocaleString()}</span><div className="history-badge">SQL Verified</div></div>
                        <div className="history-query">"{log.query}"</div>
                        <div className="history-answer"><ReactMarkdown>{log.answer}</ReactMarkdown></div>
                        <details className="history-sql-trace"><summary>View SQL Execution Trace</summary><code>{log.sql}</code></details>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="db-empty-state"><Clock size={64} className="empty-icon" /><p>Your history is empty.</p><button className="db-secondary-btn" onClick={() => setActiveTab('chat')}>Start Exploration</button></div>
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

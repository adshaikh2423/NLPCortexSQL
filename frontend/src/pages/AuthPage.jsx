import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SoftAurora from '../components/SoftAurora/SoftAurora';
import { NoiseBackground } from '../components/ui/noise-background';
import ShinyText from '../components/ShinyText/ShinyText';
import './AuthPage.css';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const toggleMode = () => setIsLogin(!isLogin);

  return (
    <div className="auth-container">
      {/* Immersive Background */}
      <div className="auth-bg">
        <SoftAurora 
          color1="#b8b8ff" color2="#e100ff"
          noiseFrequency={2.5} noiseAmplitude={1}
          bandHeight={0.5} bandSpread={1}
          octaveDecay={0.1} layerOffset={0} colorSpeed={1}
        />
      </div>

      <div className="auth-back-wrapper">
        <NoiseBackground
          containerStyle={{ borderRadius: '99px', padding: '1.5px' }}
          gradientColors={["#ffffff", "#b8b8ff"]}
        >
          <button className="auth-back-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </button>
        </NoiseBackground>
      </div>

      <motion.div 
        className="auth-card-wrapper"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo" onClick={() => navigate('/')}>
              <span className="auth-logo-dot" />
              NLPCortexSQL
            </div>
            <h2 className="auth-title">
              <ShinyText 
                text={isLogin ? "Welcome Back" : "Create Account"} 
                speed={3} 
                color="#ffffff" 
                shineColor="#ffffff" 
              />
            </h2>
            <p className="auth-subtitle">
              {isLogin ? "Access your agentic data pipeline" : "Start building with hybrid intelligence"}
            </p>
          </div>

          <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div 
                  key="name"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="auth-input-group"
                >
                  <label>Full Name</label>
                  <input type="text" placeholder="John Doe" required />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="auth-input-group">
              <label>Email Address</label>
              <input type="email" placeholder="name@company.com" required />
            </div>

            <div className="auth-input-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••" required />
            </div>

            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div 
                  key="confirm-password"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="auth-input-group"
                >
                  <label>Confirm Password</label>
                  <input type="password" placeholder="••••••••" required />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="auth-actions">
              <NoiseBackground
                containerStyle={{ borderRadius: '0.75rem', padding: '2px', width: '100%' }}
                gradientColors={["#e100ff", "#00ff88", "#cf6fff"]}
              >
                <button 
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '0.9rem',
                    background: '#050508',
                    borderRadius: '0.65rem',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '1rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'inherit'
                  }}
                >
                  {isLogin ? "Sign In" : "Get Started"}
                </button>
              </NoiseBackground>
            </div>
          </form>

          <div className="auth-footer">
            <p>
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button onClick={toggleMode} className="auth-toggle-btn">
                {isLogin ? "Sign up" : "Log in"}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;

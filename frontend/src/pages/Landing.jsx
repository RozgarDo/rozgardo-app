import React from 'react';
import { Rocket, Clock, CheckCircle2, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container page-enter">
      {/* Background Decorative Elements */}
      <div className="landing-bg-glow"></div>

      <div className="landing-content">
        
        {/* Header Section */}
        <div className="landing-header">
          <div className="landing-badge uppercase">
            <Rocket size={16} /> RozgarDo is Launching Soon
          </div>

          <h1 className="landing-title">
            Connecting workers with <br className="desktop-only" />
            <span className="highlight-text">
              real jobs
              <svg className="highlight-svg" viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M0 10 Q50 20 100 10" stroke="currentColor" strokeWidth="8" fill="none"/></svg>
            </span> across India.
          </h1>

          <p className="landing-subtitle">
            The unified platform for <strong>Drivers, Helpers, Delivery, Cooks,</strong> and <strong>Cleaners</strong>.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="landing-grid">
          <div className="feature-card group">
             <div className="feature-icon icon-blue">
               <Zap size={32} strokeWidth={2.5} />
             </div>
             <div>
               <h3 className="feature-title">Find work faster</h3>
               <p className="feature-text">Get verified jobs near you instantly and start earning without delays.</p>
             </div>
          </div>
          
          <div className="feature-card group">
             <div className="feature-icon icon-green">
               <CheckCircle2 size={32} strokeWidth={2.5} />
             </div>
             <div>
               <h3 className="feature-title">Hire instantly</h3>
               <p className="feature-text">Connect with reliable, background-checked workers perfectly suited for your needs.</p>
             </div>
          </div>
        </div>

        {/* Bottom Callout */}
        <div className="landing-footer-callout">
          <div className="landing-bottom-badge">
            <Clock size={22} className="text-primary" /> Launching Soon. Stay tuned.
          </div>
          <footer className="landing-footer">
            © 2026 RozgarDo Technologies. Built for India.
          </footer>
        </div>

      </div>
    </div>
  );
};

export default Landing;

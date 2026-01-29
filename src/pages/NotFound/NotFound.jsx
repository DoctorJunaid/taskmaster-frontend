import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './NotFound.css';

// --- Icons ---
const Icons = {
  Home: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  
  
  SystemFailure: () => (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      {/* Outer Hexagon (Matches Auth Page Logo) */}
      <path d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z" strokeWidth="4" />
      
      {/* "Dead" Inner Hexagon / Warning Symbol */}
      <line x1="50" y1="30" x2="50" y2="60" strokeWidth="6" />
      <circle cx="50" cy="78" r="4" fill="currentColor" stroke="none" />
    </svg>
  )
};

// Haptic Helper
const triggerHaptic = () => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
};

export default function NotFound() {
  const navigate = useNavigate();

  const goHome = () => {
    triggerHaptic();
    navigate('/dashboard'); 
  };

  return (
    <div className="not-found-container">
      <motion.div 
        className="mech-card-404"
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
      >
        {/* Floating "System Failure" Icon */}
        <div className="floating-icon">
          <Icons.SystemFailure />
        </div>

        <h1 className="error-title">404</h1>
        <p className="error-desc">
          System Malfunction. <br />
          The requested sector does not exist.
        </p>

        {/* 3D Mechanical Button */}
        <button className="mech-home-btn" onClick={goHome}>
          <Icons.Home />
          <span>Return to Base</span>
        </button>

      </motion.div>
    </div>
  );
}
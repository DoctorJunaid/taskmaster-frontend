import React, { useState, useRef, useEffect } from 'react';
import './Header.css';
import Avatar3D from '../Avatar3D/Avatar3D';
import { AnimatePresence, motion } from 'framer-motion';

const Icons = {
  HexLogo: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="header-logo-svg">
      <path d="M12 2l9 4.9V17L12 22l-9-4.9V7z" />
    </svg>
  ),
  User: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  LogOut: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
};

import toast from 'react-hot-toast';

const Header = ({ user, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset state when user logs out
  useEffect(() => {
    if (!user) {
      setShowDropdown(false);
      setIsLoggingOut(false);
    }
  }, [user]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const toastId = toast.loading('Logging out...', {
      style: { background: '#333', color: '#fff' }
    });

    try {
      await onLogout();
      toast.dismiss(toastId);
    } catch (error) {
      toast.error('Logout failed', { id: toastId });
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="transparent-nav">
      <div className="nav-content">

        {/* BRAND LOGO (Always Visible) */}
        <a href="/" className="nav-brand">
          <div className="brand-icon">
            <Icons.HexLogo />
          </div>
          <span className="brand-text">TaskMaster</span>
        </a>

        {/* RIGHT SIDE: Only shows User Profile if logged in. */}
        <div className="nav-actions">
          {user && (
            <div className="profile-container" ref={dropdownRef}>
              <Avatar3D
                initial={user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                onClick={() => !isLoggingOut && setShowDropdown(!showDropdown)}
              />

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    className="profile-dropdown"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className="dropdown-header">
                      <span className="dropdown-name">{user.username}</span>
                      <span className="dropdown-email">{user.email || 'User'}</span>
                    </div>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item">
                      <Icons.User /> View Profile
                    </button>
                    <button
                      className="dropdown-item logout"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                    >
                      {isLoggingOut ? (
                        <span className="loading-spinner"></span>
                      ) : (
                        <Icons.LogOut />
                      )}
                      {isLoggingOut ? 'Logging out...' : 'Logout'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Header;
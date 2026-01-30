import { useState, useRef, useEffect } from 'react';
import './Header.css';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import Avatar3D from '../Avatar3D/Avatar3d';
import { useNavigate } from 'react-router-dom';

const Icons = {
  HexLogo: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l9 4.9V17L12 22l-9-4.9V7z" />
    </svg>
  ),
  User: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
  LogOut: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
};

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const toastId = toast.loading('Logging out...');
    try {
      await logout();
      toast.dismiss(toastId);
    } catch (error) {
      toast.error('Logout failed', { id: toastId });
      setIsLoggingOut(false);
    }
  };

  const toggleDropdown = () => {
    if (!isLoggingOut) {
      setShowDropdown((prev) => !prev);
    }
  };

  return (
    <nav className="transparent-nav">
      <div className="nav-content">

        {/* BRAND */}
        <a href="/" className="nav-brand">
          <div className="brand-icon"><Icons.HexLogo /></div>
          <span className="brand-text">TaskMaster</span>
        </a>

        {/* USER ACTIONS */}
        <div className="nav-actions">
          {user && (
            <div className="profile-wrapper" ref={dropdownRef}>

              {/* 
                  AVATAR COMPONENT 
                  - Now a button receiving the onClick directly 
              */}
              <Avatar3D
                letter={user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                onClick={toggleDropdown}
              />

              {/* DROPDOWN MENU */}
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    className="profile-dropdown"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.1, ease: "easeOut" }}
                  >
                    <div className="dropdown-header">
                      <span className="dropdown-name">{user.username}</span>
                      <span className="dropdown-email">{user.email || 'user@example.com'}</span>
                    </div>

                    <button
                      className="dropdown-item"
                      onClick={() => {
                        // Navigate to profile and close dropdown
                        navigate('/dashboard/profile');
                        setShowDropdown(false);
                      }}
                    >
                      <Icons.User /> View Profile
                    </button>

                    <button className="dropdown-item logout" onClick={handleLogout} disabled={isLoggingOut}>
                      <Icons.LogOut />
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
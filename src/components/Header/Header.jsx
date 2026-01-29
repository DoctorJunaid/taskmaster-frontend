import React from 'react';
import './Header.css';

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

const Header = ({ user, onLogout }) => {
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

        {/* RIGHT SIDE: Only shows User Profile if logged in. 
            Guest buttons are REMOVED as requested. */}
        <div className="nav-actions">
          {user && (
            <div className="user-profile-pill">
              <div className="avatar-circle">
                <Icons.User />
              </div>
              <span className="user-name-text">{user.username || "User"}</span>
              <button onClick={onLogout} className="logout-mini-btn" title="Logout">
                <Icons.LogOut />
              </button>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Header;
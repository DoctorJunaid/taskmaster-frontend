import React from 'react';
import './Avatar3D.css';

const Avatar3D = ({ onClick }) => {
    return (
        <div className="avatar-3d-wrapper" onClick={onClick}>
            <div className="avatar-sphere">
                <div className="avatar-content">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="avatar-icon">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                </div>
                <div className="avatar-shine"></div>
            </div>
        </div>
    );
};

export default Avatar3D;

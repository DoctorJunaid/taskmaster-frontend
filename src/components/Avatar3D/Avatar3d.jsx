import React from 'react';
import './Avatar3d.css';

/**
 * Avatar3D Component
 * 
 * A clickable, 3D-styled button displaying the user's initial.
 * Uses semantic <button> for accessibility and reliable click handling.
 * Supports a 'size' prop for scaling.
 */
const Avatar3D = ({ onClick, letter = 'U', size = 50 }) => {
    // Calculate dynamic styles based on size prop
    // Default size is 50px
    const dynamicStyle = {
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        // Approximate font size scaling (50px -> ~22px/1.4rem)
        fontSize: `${size * 0.45}px`
    };

    return (
        <button
            type="button"
            className="avatar-btn"
            onClick={onClick}
            aria-label="User Profile"
            style={dynamicStyle}
        >
            <span className="avatar-initial">{letter}</span>
            <div className="avatar-gloss" />
        </button>
    );
};

export default Avatar3D;
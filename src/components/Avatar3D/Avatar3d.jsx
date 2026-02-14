import React from 'react';
import './Avatar3d.css';

/**
 * Avatar3D Component
 * 
 * A clickable, 3D-styled button displaying the user's initial.
 * Uses semantic <button> for accessibility and reliable click handling.
 * Supports a 'size' prop for scaling.
 */
const Avatar3D = ({ onClick, letter = 'U', size = 50, image }) => {
    // Calculate dynamic styles based on size prop
    // Default size is 50px
    const dynamicStyle = {
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        // Approximate font size scaling (50px -> ~22px/1.4rem)
        fontSize: `${size * 0.45}px`,
        padding: 0,
        overflow: 'hidden' // Ensure image respects border radius
    };

    return (
        <button
            type="button"
            className="avatar-btn"
            onClick={onClick}
            aria-label="User Profile"
            style={dynamicStyle}
        >
            {image ? (
                <img
                    src={image}
                    alt="Profile"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '50%',
                        display: 'block'
                    }}
                />
            ) : (
                <span className="avatar-initial">{letter}</span>
            )}
            <div className="avatar-gloss" />
        </button>
    );
};

export default Avatar3D;
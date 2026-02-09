import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import '../Authpage/AuthPage.css'; // Reuse AuthPage styles for consistency
import toast from 'react-hot-toast';

const Icons = {
    Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>,
    Alert: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>,
    Loader: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>,
    Logo: () => (
        <svg viewBox="0 0 100 100" className="brand-logo">
            <path d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z" strokeWidth="4" />
            <path d="M50 25 L70 35 L70 65 L50 75 L30 65 L30 35 Z" strokeWidth="3" />
            <rect x="46" y="46" width="8" height="8" fill="white" stroke="none" />
        </svg>
    )
};

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('Verifying your email...');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Invalid verification link.');
            return;
        }

        const verifyToken = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/verify-email?token=${token}`);
                if (response.data.isStatus) {
                    setStatus('success');
                    setMessage('Email verified successfully! You can now log in.');
                    toast.success('Email verified successfully!');
                } else {
                    setStatus('error');
                    setMessage(response.data.msg || 'Verification failed.');
                    toast.error(response.data.msg || 'Verification failed.');
                }
            } catch (error) {
                setStatus('error');
                const errorMsg = error.response?.data?.msg || 'An error occurred during verification.';
                setMessage(errorMsg);
                toast.error(errorMsg);
            }
        };

        verifyToken();
    }, [token]);

    return (
        <div className="page-container">
            <motion.div
                className="glass-card"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                <div className="card-border-gradient" />
                <div className="card-content" style={{ textAlign: 'center' }}>

                    <div className="auth-header" style={{ marginBottom: '20px' }}>
                        <div className="logo-hex"><Icons.Logo /></div>
                        <h1 className="app-name">TaskMaster</h1>
                    </div>

                    <div className="check-mail-container">
                        <div className="mail-icon-circle" style={{
                            color: status === 'success' ? '#4CAF50' : status === 'error' ? '#FF4545' : '#FF5E3A',
                            background: status === 'success' ? 'rgba(76, 175, 80, 0.1)' : status === 'error' ? 'rgba(255, 69, 69, 0.1)' : 'rgba(255, 94, 58, 0.1)'
                        }}>
                            {status === 'verifying' && <Icons.Loader />}
                            {status === 'success' && <Icons.Check />}
                            {status === 'error' && <Icons.Alert />}
                        </div>

                        <h3>{status === 'verifying' ? 'Verifying...' : status === 'success' ? 'Verified!' : 'Verification Failed'}</h3>
                        <p style={{ marginTop: '10px', color: '#888' }}>{message}</p>

                        {status !== 'verifying' && (
                            <button
                                className="action-btn"
                                onClick={() => navigate('/login')}
                                style={{ marginTop: '30px' }}
                            >
                                Go to Login
                            </button>
                        )}

                        {status === 'verifying' && (
                            <p style={{ marginTop: '20px', fontSize: '0.9rem', color: '#666' }}>Please wait while we verify your token.</p>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

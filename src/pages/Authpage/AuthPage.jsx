import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import './AuthPage.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'
// --- Assets ---
const Icons = {
  User: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
  Mail: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>,
  Lock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>,
  ArrowLeft: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>,
  CheckMail: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /><path d="M22 6l-10 7L2 6" /></svg>,
  Logo: () => (
    <svg viewBox="0 0 100 100" className="brand-logo">
      <path d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z" strokeWidth="4" />
      <path d="M50 25 L70 35 L70 65 L50 75 L30 65 L30 35 Z" strokeWidth="3" />
      <rect x="46" y="46" width="8" height="8" fill="white" stroke="none" />
    </svg>
  )
};

const InputField = ({ icon: Icon, type, placeholder, register, name, error }) => (
  <div className={`input-group ${error ? 'error' : ''}`}>
    <div className="input-icon"><Icon /></div>
    <input
      type={type}
      className="input-field"
      placeholder={placeholder}
      {...register(name, { required: true })}
    />
  </div>
);

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const navigate = useNavigate();
  const { login } = useAuth();

  const { register: loginReg, handleSubmit: handleLogin, formState: { errors: loginErrors, isSubmitting: loginLoading } } = useForm();
  const { register: signupReg, handleSubmit: handleSignup, formState: { errors: signupErrors, isSubmitting: signupLoading } } = useForm();
  const { register: forgotReg, handleSubmit: handleForgot, formState: { errors: forgotErrors, isSubmitting: forgotLoading }, setError: setForgotError } = useForm();

  const slideVariants = {
    enter: (direction) => ({ x: direction > 0 ? 20 : -20, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction < 0 ? 20 : -20, opacity: 0 })
  };

  const onLoginSubmit = async (data) => {

    try {
      const res = await axios.post(
        import.meta.env.VITE_API_URL + "/login",
        {
          email: data.email,
          password: data.password
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,

        }
      )
      const userData = res.data;
      login(userData)
      navigate('/dashboard');
      toast.success("Welcome back!");

    } catch (err) {
      const errorMsg = err.response?.data?.msg || err.response?.data?.message || err.message || "An error occurred";
      toast.error(errorMsg);

    }

  };

  const onSignupSubmit = async (data) => {

    try {
      const res = await axios.post(
        import.meta.env.VITE_API_URL + "/signup",
        {
          username: data.username,
          email: data.email,
          password: data.password
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,

        }
      )
      const userData = res.data;
      login(userData);
      navigate("/dashboard")
      toast.success(res.data.msg);

    } catch (err) {
      const errorMsg = err.response?.data?.msg || err.response?.data?.message || err.message || "An error occurred";
      toast.error(errorMsg);

    }
  };

  const onForgotSubmit = async (data) => {
    try {
      const res = await axios.post(
        import.meta.env.VITE_API_URL + "/forgot-password",
        {
          email: data.email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      setMode('check-mail');
      toast.success(res.data.msg);

    } catch (err) {
      const errorMsg = err.response?.data?.msg || err.response?.data?.message || err.message || "An error occurred";
      toast.error(errorMsg);

    }
  };

  return (
    <div className="page-container">

      <motion.div
        className="glass-card"
        layout
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >

        <div className="card-border-gradient" />

        <div className="card-content">
          {mode !== 'check-mail' && (
            <div className="auth-header">
              <div className="logo-hex"><Icons.Logo /></div>
              <h1 className="app-name">TaskMaster</h1>
            </div>
          )}

          {(mode === 'login' || mode === 'signup') && (
            <div className="toggle-container">
              <div className="toggle-bg">
                <motion.div
                  className="toggle-glider"
                  layoutId="glider"
                  animate={{ x: mode === 'login' ? 0 : '100%' }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              </div>
              <button className={`toggle-btn ${mode === 'login' ? 'active' : ''}`} onClick={() => setMode('login')}>Login</button>
              <button className={`toggle-btn ${mode === 'signup' ? 'active' : ''}`} onClick={() => setMode('signup')}>Sign Up</button>
            </div>
          )}

          <div className="forms-wrapper">
            <AnimatePresence mode="wait" custom={mode === 'login' ? 1 : -1}>

              {mode === 'login' && (
                <motion.form
                  key="login"
                  custom={1}
                  variants={slideVariants} initial="enter" animate="center" exit="exit"
                  transition={{ duration: 0.2 }}
                  onSubmit={handleLogin(onLoginSubmit)}
                  className="auth-form"
                >
                  <InputField icon={Icons.Mail} type="email" placeholder="Email Address" name="email" register={loginReg} error={loginErrors.email} />
                  <InputField icon={Icons.Lock} type="password" placeholder="Password" name="password" register={loginReg} error={loginErrors.password} />

                  <a href="#" onClick={(e) => { e.preventDefault(); setMode('forgot'); }} className="forgot-pass">
                    Forgot Password?
                  </a>

                  <button type="submit" className="action-btn" disabled={loginLoading}>
                    {loginLoading ? 'Authenticating...' : 'Log In'}
                  </button>
                </motion.form>
              )}

              {mode === 'signup' && (
                <motion.form
                  key="signup"
                  custom={-1}
                  variants={slideVariants} initial="enter" animate="center" exit="exit"
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSignup(onSignupSubmit)}
                  className="auth-form"
                >
                  <InputField icon={Icons.User} type="text" placeholder="User Name" name="username" register={signupReg} error={signupErrors.username} />
                  <InputField icon={Icons.Mail} type="email" placeholder="Email Address" name="email" register={signupReg} error={signupErrors.email} />
                  <InputField icon={Icons.Lock} type="password" placeholder="Create Password" name="password" register={signupReg} error={signupErrors.password} />

                  <button type="submit" className="action-btn" disabled={signupLoading}>
                    {signupLoading ? 'Creating...' : 'Create Account'}
                  </button>
                </motion.form>
              )}

              {mode === 'forgot' && (
                <motion.form
                  key="forgot"
                  variants={slideVariants} initial="enter" animate="center" exit="exit"
                  transition={{ duration: 0.2 }}
                  onSubmit={handleForgot(onForgotSubmit)}
                  className="auth-form"
                >
                  <div className="form-header-text">
                    <h3>Reset Password</h3>
                    <p>Enter your email to receive instructions.</p>
                  </div>
                  <InputField icon={Icons.Mail} type="email" placeholder="Email Address" name="email" register={forgotReg} error={forgotErrors.email} />
                  <button type="submit" className="action-btn" disabled={forgotLoading}>
                    {forgotLoading ? 'Sending...' : 'Send Link'}
                  </button>
                  <div className="back-link-container">
                    <a href="#" onClick={(e) => { e.preventDefault(); setMode('login'); }} className="back-link">
                      Back to Login
                    </a>
                  </div>
                </motion.form>
              )}

              {mode === 'check-mail' && (
                <motion.div
                  key="check-mail"
                  variants={slideVariants} initial="enter" animate="center" exit="exit"
                  transition={{ duration: 0.2 }}
                  className="check-mail-container"
                >
                  <div className="mail-icon-circle"><Icons.CheckMail /></div>
                  <h3>Check your mail</h3>
                  <p>We have sent recovery instructions to your email.</p>
                  <button className="action-btn" onClick={() => window.open('mailto:')}>Open Email App</button>
                  <div className="back-link-container">
                    <a href="#" onClick={(e) => { e.preventDefault(); setMode('login'); }} className="back-link">
                      Skip, I'll confirm later
                    </a>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
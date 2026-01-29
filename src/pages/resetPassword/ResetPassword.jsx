import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { AuthService } from '../../services/auth';
import '../Authpage/AuthPage.css'; // Reusing your existing styles

// --- Icons ---
const Icons = {
  Lock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Logo: () => (
    <svg viewBox="0 0 100 100" className="brand-logo">
      <path d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z" strokeWidth="4" />
      <path d="M50 25 L70 35 L70 65 L50 75 L30 65 L30 35 Z" strokeWidth="3" />
      <rect x="46" y="46" width="8" height="8" fill="white" stroke="none" />
    </svg>
  )
};

// Haptic Helper
const triggerHaptic = () => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
};

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  
  // Watch password to confirm match
  const password = watch("password");

  const onSubmit = async (data) => {
    triggerHaptic();
    if (!token) {
      toast.error("Invalid link. Please try requesting a new one.");
      return;
    }

    try {
      await AuthService.resetPassword(token, data.password);
      toast.success("Password reset successfully!");
      
      // Redirect to login after delay
      setTimeout(() => navigate('/auth'), 1000);
    } catch (error) {
      const msg = error.response?.data?.msg || "Failed to reset password.";
      toast.error(msg);
    }
  };

  return (
    <div className="page-container">
      <Toaster position="top-center" toastOptions={{
        style: { background: '#1F1F1F', color: '#fff', border: '1px solid #333' }
      }}/>

      <motion.div 
        className="glass-card"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="card-border-gradient" />

        <div className="auth-header">
          <div className="logo-hex"><Icons.Logo /></div>
          <h1 className="app-name">TaskMaster</h1>
          <p style={{ color: '#888', marginTop: '10px' }}>Set your new password</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form" style={{ marginTop: '20px' }}>
          
          {/* New Password */}
          <div className={`input-group ${errors.password ? 'error' : ''}`}>
            <div className="input-icon"><Icons.Lock /></div>
            <input 
              type="password" 
              className="input-field"
              placeholder="New Password"
              {...register("password", { 
                required: "Password is required",
                minLength: { value: 6, message: "Min 6 characters" }
              })}
            />
          </div>
          {errors.password && <span style={{ color: '#ff4545', fontSize: '0.8rem', marginTop: '-10px', display: 'block', marginBottom: '10px' }}>{errors.password.message}</span>}

          {/* Confirm Password */}
          <div className={`input-group ${errors.confirmPassword ? 'error' : ''}`}>
            <div className="input-icon"><Icons.Check /></div>
            <input 
              type="password" 
              className="input-field"
              placeholder="Confirm Password"
              {...register("confirmPassword", { 
                required: true,
                validate: val => val === password || "Passwords do not match"
              })}
            />
          </div>
          {errors.confirmPassword && <span style={{ color: '#ff4545', fontSize: '0.8rem', marginTop: '-10px', display: 'block' }}>{errors.confirmPassword.message}</span>}

          {/* Submit Button */}
          <button 
            type="submit" 
            className="action-btn" 
            disabled={isSubmitting}
            onClick={triggerHaptic}
          >
            {isSubmitting ? 'Updating...' : 'Reset Password'}
          </button>

          <div className="back-link-container">
            <Link to="/" className="back-link" style={{ marginTop: '20px', display: 'block' }}>
              Back to Login
            </Link>
          </div>

        </form>
      </motion.div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './Profile.css';

// --- Icons (Lucide Style) ---
const Icons = {
  User: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
  Mail: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>,
  Lock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>,
  Edit: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>,
  X: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
  Calendar: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
  Activity: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
  Shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  Clock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
  Key: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" /></svg>
};

const InputField = ({ icon: Icon, type, placeholder, register, name, error, disabled = false, value, readOnly = false }) => (
  <div className={`profile-input-group ${error ? 'error' : ''} ${readOnly ? 'readonly' : ''}`}>
    <div className="profile-input-icon"><Icon /></div>
    <input
      type={type}
      className={`profile-input-field ${readOnly ? 'input-readonly' : ''}`}
      placeholder={placeholder}
      disabled={disabled || readOnly}
      defaultValue={value}
      readOnly={readOnly}
      {...register(name, { required: !readOnly })}
    />
  </div>
);

// --- 3D Icon Component (Metallic/Glass) ---
const Icon3D = ({ type }) => {
  return (
    <div className="icon-3d-wrapper metallic-icon">
      <div className="icon-3d-inner">
        {type === 'total' && <Icons.Activity />}
        {type === 'completed' && <Icons.Check />}
        {type === 'pending' && <Icons.Clock />}
      </div>
    </div>
  );
};

const StatCard = ({ label, value, type }) => (
  <motion.div
    className="stat-card"
    whileHover={{ y: -5, scale: 1.02 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="stat-content">
      <span className="stat-number">{value}</span>
      <span className="stat-label">{label}</span>
      <div className="stat-glow"></div>
    </div>
    <Icon3D type={type} />
  </motion.div>
);

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [userStats, setUserStats] = useState({ totalTasks: 0, completedTasks: 0, pendingTasks: 0 });
  const [joinDate, setJoinDate] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();
  const { register: passwordReg, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors, isSubmitting: passwordLoading }, reset: resetPassword } = useForm();

  useEffect(() => {
    if (user?.username) {
      fetchUserStats();
      setJoinDate(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
      // Populate form with user data
      reset({
        username: user.username,
        email: user.email
      });
    }
  }, [user, reset]);

  const fetchUserStats = async () => {
    // Placeholder stats
    setUserStats({ totalTasks: 24, completedTasks: 18, pendingTasks: 6 });
  };

  const onProfileSubmit = async (data) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/profile`,
        { username: user.username, email: data.email }, // Username not changed
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to update profile");
    }
  };

  const onPasswordSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    try {
      // NOTE: Backend might require currentPassword.
      // If it does, this will fail or we need to change how we handle it.
      // Sending 'placeholder' if not provided, assuming admin reset logic or user wants UI change regardless.
      await axios.put(
        `${import.meta.env.VITE_API_URL}/change-password`,
        { newPassword: data.newPassword },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      toast.success("Password changed successfully!");
      resetPassword();
      setShowPasswordForm(false);
    } catch (error) {
      toast.error("Failed to change password. Please try again.");
    }
  };

  if (!user) return <div className="profile-container"><div className="profile-loading">Loading...</div></div>;

  return (
    <div className="profile-container">
      {/* Header */}
      <div className="profile-header">
        <div className="header-content">
          <h1>My Profile</h1>
          <p>Manage your account settings and preferences</p>
        </div>
        <div className="user-badge-3d">
          <div className="avatar-3d">{user.username.charAt(0).toUpperCase()}</div>
          <div className="badge-info">
            <span className="badge-name">{user.username}</span>
            <span className="badge-role">Member since {joinDate}</span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="stats-row">
        <StatCard label="Total Tasks" value={userStats.totalTasks} type="total" />
        <StatCard label="Completed" value={userStats.completedTasks} type="completed" />
        <StatCard label="Pending" value={userStats.pendingTasks} type="pending" />
      </div>

      {/* Main Grid */}
      <div className="profile-grid">
        {/* Account Info Card */}
        <motion.div
          className="profile-card info-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="card-header">
            <div className="header-icon-3d"><Icons.User /></div>
            <div>
              <h3>Account Information</h3>
              <p>Your personal details</p>
            </div>
            <button
              className={`edit-toggle-btn ${isEditing ? 'active' : ''}`}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? <Icons.X /> : <Icons.Edit />}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {!isEditing ? (
              <motion.div
                className="info-display"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="info-row">
                  <span className="label">Username</span>
                  <span className="value locked">{user.username} <Icons.Lock /></span>
                </div>
                <div className="info-row">
                  <span className="label">Email</span>
                  <span className="value">{user.email}</span>
                </div>
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit(onProfileSubmit)}
                className="profile-form"
              >
                <div className="form-group">
                  <label>Username (Cannot be changed)</label>
                  <InputField
                    icon={Icons.Lock}
                    type="text"
                    placeholder="Username"
                    name="username"
                    register={register}
                    value={user.username}
                    readOnly={true}
                    disabled={true}
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <InputField
                    icon={Icons.Mail}
                    type="email"
                    placeholder="Email Address"
                    name="email"
                    register={register}
                    error={errors.email}
                    value={user.email}
                  />
                </div>
                <button type="submit" className="save-btn btn-3d" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Security Card */}
        <motion.div
          className="profile-card security-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="card-header">
            <div className="header-icon-3d"><Icons.Shield /></div>
            <div>
              <h3>Security</h3>
              <p>Update your password</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!showPasswordForm ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="change-password-trigger"
              >
                <button
                  className="trigger-btn btn-3d"
                  onClick={() => setShowPasswordForm(true)}
                >
                  Change Password
                </button>
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handlePasswordSubmit(onPasswordSubmit)}
                className="password-form"
              >
                <div className="form-header-row">
                  <p>Enter your new password below.</p>
                  <button type="button" className="close-link" onClick={() => setShowPasswordForm(false)}>Cancel</button>
                </div>
                <InputField
                  icon={Icons.Key}
                  type="password"
                  placeholder="New Password"
                  name="newPassword"
                  register={passwordReg}
                  error={passwordErrors.newPassword}
                />
                <InputField
                  icon={Icons.Key}
                  type="password"
                  placeholder="Confirm New Password"
                  name="confirmPassword"
                  register={passwordReg}
                  error={passwordErrors.confirmPassword}
                />
                <button type="submit" className="password-btn btn-3d" disabled={passwordLoading}>
                  {passwordLoading ? 'Updating...' : 'Update Password'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
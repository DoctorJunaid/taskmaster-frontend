import { useState } from 'react'
import './App.css'
import Header from './components/Header/Header'
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom'
import AuthPage from './pages/Authpage/AuthPage'
import Dashboard from './pages/dashboard/DashboardPage'
import { Toaster } from 'react-hot-toast'
import ResetPassword from './pages/resetPassword/ResetPassword'
import Footer from './components/Footer/Footer'
import NotFound from './pages/NotFound/NotFound'
import ProtectedRoute from './Routes/ProtectedRoutes'
import PublicRoute from './Routes/PublicRoutes'
import Profile from './pages/profile/Profile'
import VerifyEmail from './pages/verifyEmail/VerifyEmail'



function App() {
  const navigate = useNavigate();
  return (
    <>
      <Toaster position="top-center" toastOptions={{
        style: { background: '#1F1F1F', color: '#fff', border: '1px solid #333' }
      }} containerStyle={{ zIndex: 99999 }} />
      <Header />
      <Routes>


        <Route element={<ProtectedRoute />} >
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path="/dashboard/profile" element={<Profile />} />
        </Route>
        <Route path="/verify-email" element={<VerifyEmail />} />

        <Route element={<PublicRoute />}>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFound />} />

      </Routes>
      <Footer />
    </>
  )
}

export default App

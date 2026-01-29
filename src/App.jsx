import { useState } from 'react'
import './App.css'
import AuthPage from './pages/AuthPage'
import Header from './components/Header'
import { Route, Routes } from 'react-router-dom'

function App() {

  return (
    <>
    <Header />
    <Routes>
      <Route path="/" element={<AuthPage />} />
    </Routes>
    </>
  )
}

export default App

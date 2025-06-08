import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './components/LoginPage'
import AdminDashboard from './components/AdminDashboard'
import Hero from './components/Hero'
import OurStory from './components/OurStory'
import WeddingDetails from './components/WeddingDetails'
import PhotoGallery from './components/PhotoGallery'
import RSVP from './components/RSVP'
import ThankYou from './components/ThankYou'

const WeddingWebsite: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <OurStory />
      <WeddingDetails />
      <PhotoGallery />
      <RSVP />
      <ThankYou />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<WeddingWebsite />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StudyDashboard from './components/StudyDashboard';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import AboutUs from './components/AboutUs';
import StudyGuideDashboard from './components/StudyGuideDashboard';
import AllStudyGuides from './components/AllStudyGuides';

const App = () => (
  <AuthProvider>
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <StudyDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/all-study-guides"
            element={
              <ProtectedRoute>
                <AllStudyGuides />
              </ProtectedRoute>
            }
          />
          <Route
            path="/study/:title"
            element={
              <ProtectedRoute>
                <StudyGuideDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  </AuthProvider>
);

export default App;

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
import NewStudyGuide from './components/pages/NewStudyGuide';
import AskSpark from './components/pages/AskSpark';
import CheatSheet from './components/pages/CheatSheet';
import MockExam from './components/pages/MockExam';
import FlashCards from './components/pages/FlashCards';
import Layout from './components/Layout';

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
                <Layout>
                  <StudyDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/all-study-guides"
            element={
              <ProtectedRoute>
                <Layout>
                  <AllStudyGuides />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/study/:title"
            element={
              <ProtectedRoute>
                <Layout>
                  <StudyGuideDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/study/:title/ask"
            element={
              <ProtectedRoute>
                <Layout>
                  <AskSpark />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/study/:title/cheat-sheet"
            element={
              <ProtectedRoute>
                <Layout>
                  <CheatSheet />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/study/:title/mock-exam"
            element={
              <ProtectedRoute>
                <Layout>
                  <MockExam />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/study/:title/flash-cards"
            element={
              <ProtectedRoute>
                <Layout>
                  <FlashCards />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/new-study-guide"
            element={
              <ProtectedRoute>
                <Layout>
                  <NewStudyGuide />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  </AuthProvider>
);

export default App;

import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StudyDashboard from './components/StudyDashboard';
import AboutUs from './components/AboutUs';
import StudyGuideDashboard from './components/StudyGuideDashboard';
import AllStudyGuides from './components/AllStudyGuides';
import NewStudyGuide from './components/pages/NewStudyGuide';
import AskSpark from './components/pages/AskSpark';
import CheatSheet from './components/pages/CheatSheet';
import MockExam from './components/pages/MockExam';
import FlashCards from './components/pages/FlashCards';
import Layout from './components/Layout';
import ViewStudyGuide from './components/pages/ViewStudyGuide';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';

const App = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1 bg-gray-50">
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/dashboard" element={<Layout><StudyDashboard /></Layout>} />
        <Route path="/all-study-guides" element={<Layout><AllStudyGuides /></Layout>} />
        <Route path="/study/:id" element={<Layout><ViewStudyGuide /></Layout>} />
        <Route path="/study" element={<Layout><StudyGuideDashboard /></Layout>} />
        <Route path="/study/ask" element={<Layout><AskSpark /></Layout>} />
        <Route path="/study/cheat-sheet" element={<Layout><CheatSheet /></Layout>} />
        <Route path="/study/mock-exam" element={<Layout><MockExam /></Layout>} />
        <Route path="/study/flash-cards" element={<Layout><FlashCards /></Layout>} />
        <Route path="/new-study-guide" element={<Layout><NewStudyGuide /></Layout>} />
      </Routes>
    </main>
  </div>
);

export default App;

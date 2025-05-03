import React from 'react';
import { useNavigate } from 'react-router-dom';
import StudyCard from './StudyCard';

const studies = [
  { title: 'Biology', date: '2 hours ago' },
  { title: 'World History', date: 'Yesterday' },
  { title: 'Computer Science', date: 'April 20, 2024' },
  { title: 'Psychology', date: 'April 18, 2024' },
  { title: 'Statistics', date: 'April 16, 2024' },
];

const StudyDashboard = () => {
  const navigate = useNavigate();
  // Render all study cards, then the plus card as the last item
  const cards = [
    ...studies.map((study) => (
      <StudyCard key={study.title} title={study.title} date={study.date} />
    )),
    <div
      key="plus-card"
      onClick={() => navigate('/all-study-guides')}
      className="bg-white border-2 border-dashed border-blue-400 text-blue-600 p-6 rounded-xl shadow-md flex flex-col items-center justify-center gap-2 hover:bg-blue-50 hover:scale-105 hover:shadow-xl transition-transform duration-200 cursor-pointer min-h-[120px]"
      title="View All Study Guides"
    >
      <span className="text-4xl font-bold mb-2">+</span>
      <span className="font-semibold">View All</span>
    </div>
  ];
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-8 px-2 relative">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h1 className="text-3xl font-extrabold text-gray-900">Your Study Guides</h1>
          <button className="px-8 py-3 rounded-full bg-blue-600 text-white font-semibold text-lg shadow hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400">
            + Generate New Study Guide
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards}
        </div>
      </div>
    </div>
  );
};

export default StudyDashboard;

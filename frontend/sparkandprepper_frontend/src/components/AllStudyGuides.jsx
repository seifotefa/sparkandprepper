import React from 'react';
import StudyCard from './StudyCard';

// Mock: all past study guides (could be more than the recent ones)
const allStudies = [
  { title: 'Biology', date: '2 hours ago' },
  { title: 'World History', date: 'Yesterday' },
  { title: 'Computer Science', date: 'April 20, 2024' },
  { title: 'Psychology', date: 'April 18, 2024' },
  { title: 'Statistics', date: 'April 16, 2024' },
  { title: 'Mathematics', date: 'April 10, 2024' },
  { title: 'English Literature', date: 'April 5, 2024' },
  { title: 'Physics', date: 'March 30, 2024' },
  { title: 'Chemistry', date: 'March 25, 2024' },
];

const AllStudyGuides = () => (
  <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-8 px-2">
    <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-8 md:p-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">All Study Guides</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {allStudies.map((study, idx) => (
          <StudyCard key={idx} title={study.title} date={study.date} />
        ))}
      </div>
    </div>
  </div>
);

export default AllStudyGuides; 
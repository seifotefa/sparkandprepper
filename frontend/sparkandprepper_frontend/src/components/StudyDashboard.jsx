import React, { useEffect, useState } from 'react';
import StudyCard from './StudyCard'; // assuming you're using the StudyCard component
import Chatbot from './chatbot'; // Import with correct casing
import { useNavigate } from 'react-router-dom';

const StudyDashboard = () => {
  const [studyGuides, setStudyGuides] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedGuides = JSON.parse(localStorage.getItem('allStudyGuides') || '[]');
    setStudyGuides(savedGuides);
  }, []);

  if (!studyGuides || studyGuides.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">No study guides found.</h2>
        <p className="text-blue-600 mb-4">Upload one to get started!</p>
        <button
          onClick={() => navigate('/new-study-guide')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Upload Study Guide
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-8">
      {/* Study guides grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {studyGuides.map((guide, index) => (
          <StudyCard
            key={index}
            title={guide.fileName}
            date={new Date(guide.timestamp).toLocaleString()}
            onClick={() => {
              localStorage.setItem('currentStudyGuide', JSON.stringify(guide));
              navigate('/study');
            }}
          />
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => navigate('/new-study-guide')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Add Study Guide
        </button>
      </div>
      
    </div>
  );
};

export default StudyDashboard;

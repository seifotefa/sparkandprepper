import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ViewStudyGuide = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [guide, setGuide] = useState(null);

  useEffect(() => {
    const guides = JSON.parse(localStorage.getItem('studyGuides') || '[]');
    const found = guides.find(g => g.id === id);
    if (found) {
      setGuide(found);
    } else {
      alert('Study guide not found!');
      navigate('/dashboard');
    }
  }, [id, navigate]);

  if (!guide) {
    return <div className="p-8 text-center text-blue-700">Loading study guide...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-10 px-4 bg-[var(--color-prepper-blue-light)]" style={{ fontFamily: 'Inter, Arial, sans-serif' }}>
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 md:p-10 border border-blue-100">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">{guide.fileName.replace('.pdf', '')}</h1>
        <p className="text-sm text-gray-500 mb-6">Created: {new Date(guide.timestamp).toLocaleString()}</p>

        <div className="space-y-4">
          <a href={guide.studyGuide} target="_blank" rel="noopener noreferrer" className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition">
            View Study Guide PDF
          </a>
          <a href={guide.mockExam} target="_blank" rel="noopener noreferrer" className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition">
            View Mock Exam PDF
          </a>
          <a href={guide.cheatSheet} target="_blank" rel="noopener noreferrer" className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition">
            View Cheat Sheet PDF
          </a>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 mt-4 overflow-auto max-h-96">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">Flashcards</h2>
            {guide.flashcards.split('\n\n').filter(card => card.trim()).map((card, idx) => (
              <div key={idx} className="mb-4 p-3 rounded bg-white shadow border border-blue-100">
                {card.split('\n').map((line, i) => (
                  <p key={i} className={line.startsWith('Q:') ? 'font-bold text-blue-700' : 'text-blue-900'}>
                    {line}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => navigate('/dashboard')} className="mt-6 px-6 py-2 bg-gray-200 rounded-lg text-blue-700 font-semibold hover:bg-gray-300 transition">
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ViewStudyGuide;

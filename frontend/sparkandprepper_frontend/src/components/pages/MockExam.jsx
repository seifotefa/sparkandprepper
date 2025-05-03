import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const BackArrowIcon = ({ size = 24, color = "#5B6478" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M15 19l-7-7 7-7" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MockExam = () => {
  const navigate = useNavigate();
  const { title } = useParams();

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[var(--color-prepper-blue-light)] py-8 px-2" style={{ fontFamily: 'Inter, Arial, sans-serif' }}>
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-blue-100" style={{ boxShadow: '0 8px 32px 0 rgba(37,99,235,0.10)' }}>
        {/* Back button */}
        <button
          onClick={() => navigate(`/study/${encodeURIComponent(title)}`)}
          className="flex items-center gap-2 text-blue-700 hover:text-blue-900 mb-8 group"
        >
          <BackArrowIcon size={24} color="currentColor" />
          <span className="font-semibold">Back to Study Guide</span>
        </button>

        {/* Title */}
        <h1 className="text-3xl font-bold text-blue-900 mb-8 text-center">{title} - Mock Exam</h1>

        {/* Mock exam content placeholder */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-full max-w-2xl min-h-[400px] flex flex-col items-center justify-center bg-blue-50 border-2 border-blue-200 rounded-xl p-8 mb-8">
            <span className="text-2xl font-semibold text-blue-900 text-center">Mock Exam Coming Soon</span>
            <p className="mt-4 text-blue-600 text-center">Practice questions and mock exams will be available here to test your knowledge.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockExam; 
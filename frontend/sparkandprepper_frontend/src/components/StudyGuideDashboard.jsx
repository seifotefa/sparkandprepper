import React from 'react';
import { useParams } from 'react-router-dom';

const StudyGuideDashboard = () => {
  const { title } = useParams();

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-8 px-2">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl p-6 md:p-10 flex flex-col lg:flex-row gap-8">
        {/* Mock PDF viewer */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-full h-96 bg-gray-200 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-400 mb-4">
            <span className="text-gray-500 text-lg">[Mock PDF for <span className='font-bold'>{title}</span> Study Guide]</span>
          </div>
          <div className="text-center text-xl font-bold text-gray-800">{title} Study Guide</div>
        </div>
        {/* Functionality buttons */}
        <div className="flex flex-col gap-6 w-full max-w-xs mx-auto lg:mx-0 lg:w-80 justify-center">
          <button className="w-full py-4 px-6 rounded-xl bg-blue-600 text-white font-semibold text-lg shadow hover:bg-blue-700 transition-colors duration-200 flex items-center gap-3 justify-center">
            <span role="img" aria-label="ai">🤖</span> Ask Spark
          </button>
          <button className="w-full py-4 px-6 rounded-xl bg-yellow-400 text-gray-900 font-semibold text-lg shadow hover:bg-yellow-500 transition-colors duration-200 flex items-center gap-3 justify-center">
            <span role="img" aria-label="cheat sheet">📝</span> Cheat Sheet
          </button>
          <button className="w-full py-4 px-6 rounded-xl bg-green-500 text-white font-semibold text-lg shadow hover:bg-green-600 transition-colors duration-200 flex items-center gap-3 justify-center">
            <span role="img" aria-label="mock exam">🧪</span> Mock Exam
          </button>
          <button className="w-full py-4 px-6 rounded-xl bg-pink-500 text-white font-semibold text-lg shadow hover:bg-pink-600 transition-colors duration-200 flex items-center gap-3 justify-center">
            <span role="img" aria-label="flash cards">🃏</span> Flash Cards
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudyGuideDashboard; 
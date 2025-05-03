import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Simpler, more recognizable SVG icons
const SparkIcon = ({ size = 22, color = "#1e3a8a" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><rect x="3" y="7" width="18" height="10" rx="3" stroke={color} strokeWidth="2"/><path d="M7 17v2a2 2 0 002 2h6a2 2 0 002-2v-2" stroke={color} strokeWidth="2"/></svg>
);
const SheetIcon = ({ size = 22, color = "#1e3a8a" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><rect x="5" y="3" width="14" height="18" rx="2" stroke={color} strokeWidth="2"/><path d="M8 7h8M8 11h8M8 15h5" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>
);
const ExamIcon = ({ size = 22, color = "#1e3a8a" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="3" stroke={color} strokeWidth="2"/><path d="M8 12l2 2 4-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const CardsIcon = ({ size = 22, color = "#1e3a8a" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><rect x="7" y="7" width="10" height="10" rx="2" stroke={color} strokeWidth="2"/><rect x="3" y="11" width="6" height="6" rx="1" stroke={color} strokeWidth="2"/><rect x="15" y="3" width="6" height="6" rx="1" stroke={color} strokeWidth="2"/></svg>
);

const flashCards = Array.from({ length: 10 }, (_, i) => ({
  front: `Card ${i + 1} Front`,
  back: `Card ${i + 1} Back`,
}));

const StudyGuideDashboard = () => {
  const { title } = useParams();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('pdf');
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const renderBoxContent = () => {
    switch (selectedTab) {
      case 'ask':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <h2 className="text-xl font-bold text-blue-700 mb-4">Ask Spark (Chatbot Coming Soon)</h2>
            <div className="w-full max-w-md bg-blue-50 border border-blue-200 rounded-lg p-6 text-blue-900 text-center">Chatbot integration placeholder.</div>
          </div>
        );
      case 'sheet':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <h2 className="text-xl font-bold text-blue-700 mb-4">Cheat Sheet</h2>
            <div className="w-full max-w-md bg-blue-50 border border-blue-200 rounded-lg p-6 text-blue-900 text-center">Cheat sheet content placeholder.</div>
          </div>
        );
      case 'exam':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <h2 className="text-xl font-bold text-blue-700 mb-4">Mock Exam</h2>
            <div className="w-full max-w-md bg-blue-50 border border-blue-200 rounded-lg p-6 text-blue-900 text-center">Mock exam content placeholder.</div>
          </div>
        );
      case 'cards':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <h2 className="text-xl font-bold text-blue-700 mb-4">Flash Cards</h2>
            <div className="w-full max-w-xs min-h-[180px] flex flex-col items-center justify-center bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4 cursor-pointer select-none" onClick={() => setFlipped(f => !f)}>
              <span className="text-lg font-semibold text-blue-900">{flipped ? flashCards[cardIndex].back : flashCards[cardIndex].front}</span>
              <span className="mt-2 text-xs text-blue-400">(Click to flip)</span>
            </div>
            <div className="flex gap-4">
              <button className="px-4 py-2 rounded bg-blue-200 text-blue-900 font-bold" onClick={() => { setCardIndex(i => Math.max(i - 1, 0)); setFlipped(false); }} disabled={cardIndex === 0}>Prev</button>
              <button className="px-4 py-2 rounded bg-blue-200 text-blue-900 font-bold" onClick={() => { setCardIndex(i => Math.min(i + 1, flashCards.length - 1)); setFlipped(false); }} disabled={cardIndex === flashCards.length - 1}>Next</button>
            </div>
            <div className="mt-2 text-blue-500">Card {cardIndex + 1} of {flashCards.length}</div>
          </div>
        );
      default:
        return (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">{title} Study Guide</h2>
            <div className="w-full h-96 bg-blue-50 rounded-xl flex items-center justify-center border-2 border-dashed border-blue-200">
              <span className="text-blue-300 text-lg" style={{ fontFamily: 'Inter, Arial, sans-serif' }}>[Mock PDF for <span className='font-bold text-[var(--color-prepper-blue)]'>{title}</span> Study Guide]</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-[80vh] flex items-start justify-center bg-[var(--color-prepper-blue-light)] py-8 px-2" style={{ fontFamily: 'Inter, Arial, sans-serif' }}>
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl p-6 md:p-10 flex flex-col lg:flex-row justify-center gap-8 border border-blue-100" style={{ boxShadow: '0 8px 32px 0 rgba(37,99,235,0.10)' }}>
        {/* Main Box */}
        <div className="flex-1 flex flex-col items-start justify-start">
          {renderBoxContent()}
        </div>
        {/* Functionality buttons */}
        <div className="flex flex-col gap-6 w-full max-w-xs lg:w-80 h-96 mt-12">
          <div className="flex-1" />
          <button className={`w-full py-4 px-6 rounded-xl bg-yellow-700 text-white font-bold text-lg shadow hover:bg-yellow-800 transition-colors duration-200 flex items-center gap-3 border border-yellow-700 ${selectedTab === 'ask' ? 'ring-4 ring-yellow-300' : ''}`}
            onClick={() => { setSelectedTab('ask'); setFlipped(false); navigate(`/study/${encodeURIComponent(title)}/ask`); }}>
            <SparkIcon size={22} color="#ffffff" /> <span className="text-white font-bold">Ask Spark</span>
          </button>
          <button className={`w-full py-4 px-6 rounded-xl bg-yellow-500 text-white font-bold text-lg shadow hover:bg-yellow-600 transition-colors duration-200 flex items-center gap-3 border border-yellow-500 ${selectedTab === 'sheet' ? 'ring-4 ring-yellow-200' : ''}`}
            onClick={() => { setSelectedTab('sheet'); setFlipped(false); navigate(`/study/${encodeURIComponent(title)}/cheat-sheet`); }}>
            <SheetIcon size={22} color="#ffffff" /> <span className="text-white font-bold">Cheat Sheet</span>
          </button>
          <button className={`w-full py-4 px-6 rounded-xl bg-blue-500 text-white font-bold text-lg shadow hover:bg-blue-600 transition-colors duration-200 flex items-center gap-3 border border-blue-500 ${selectedTab === 'exam' ? 'ring-4 ring-blue-200' : ''}`}
            onClick={() => { setSelectedTab('exam'); setFlipped(false); navigate(`/study/${encodeURIComponent(title)}/mock-exam`); }}>
            <ExamIcon size={22} color="#ffffff" /> <span className="text-white font-bold">Mock Exam</span>
          </button>
          <button className={`w-full py-4 px-6 rounded-xl bg-blue-500 text-white font-bold text-lg shadow hover:bg-blue-600 transition-colors duration-200 flex items-center gap-3 border border-blue-500 ${selectedTab === 'cards' ? 'ring-4 ring-blue-200' : ''}`}
            onClick={() => { setSelectedTab('cards'); setFlipped(false); navigate(`/study/${encodeURIComponent(title)}/flash-cards`); }}>
            <CardsIcon size={22} color="#ffffff" /> <span className="text-white font-bold">Flash Cards</span>
          </button>
          <div className="flex-1" />
        </div>
      </div>
    </div>
  );
};

export default StudyGuideDashboard; 
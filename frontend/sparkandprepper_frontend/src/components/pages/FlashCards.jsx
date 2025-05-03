import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const BackArrowIcon = ({ size = 24, color = "#5B6478" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M15 19l-7-7 7-7" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const flashCards = Array.from({ length: 10 }, (_, i) => ({
  front: `Card ${i + 1} Front`,
  back: `Card ${i + 1} Back`,
}));

const FlashCards = () => {
  const navigate = useNavigate();
  const { title } = useParams();
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

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
        <h1 className="text-3xl font-bold text-blue-900 mb-8 text-center">{title} - Flash Cards</h1>

        {/* Flash Card */}
        <div className="flex flex-col items-center justify-center">
          <div 
            className="w-full max-w-2xl min-h-[400px] flex flex-col items-center justify-center bg-blue-50 border-2 border-blue-200 rounded-xl p-8 mb-8 cursor-pointer select-none transform transition-transform duration-300 hover:scale-[1.02]"
            onClick={() => setFlipped(f => !f)}
            style={{ boxShadow: '0 4px 16px 0 rgba(37,99,235,0.10)' }}
          >
            <span className="text-2xl font-semibold text-blue-900 text-center">{flipped ? flashCards[cardIndex].back : flashCards[cardIndex].front}</span>
            <span className="mt-4 text-sm text-blue-400">(Click to flip)</span>
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-6">
            <button 
              className="px-6 py-3 rounded-lg bg-blue-200 text-blue-900 font-bold text-lg hover:bg-blue-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => { setCardIndex(i => Math.max(i - 1, 0)); setFlipped(false); }}
              disabled={cardIndex === 0}
            >
              Previous
            </button>
            <button 
              className="px-6 py-3 rounded-lg bg-blue-200 text-blue-900 font-bold text-lg hover:bg-blue-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => { setCardIndex(i => Math.min(i + 1, flashCards.length - 1)); setFlipped(false); }}
              disabled={cardIndex === flashCards.length - 1}
            >
              Next
            </button>
          </div>

          {/* Progress indicator */}
          <div className="mt-6 text-lg text-blue-600 font-medium">
            Card {cardIndex + 1} of {flashCards.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashCards; 
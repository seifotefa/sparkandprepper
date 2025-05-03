import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const BackArrowIcon = ({ size = 24, color = "#5B6478" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M15 19l-7-7 7-7" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const AiIcon = ({ size = 32, color = "#3b82f6" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="16" fill={color} />
    <ellipse cx="16" cy="20" rx="7" ry="3" fill="#fff" />
    <circle cx="12" cy="14" r="2" fill="#fff" />
    <circle cx="20" cy="14" r="2" fill="#fff" />
    <rect x="13" y="17" width="6" height="2" rx="1" fill="#fff" />
  </svg>
);

const AskSpark = () => {
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
        <h1 className="text-3xl font-bold text-blue-900 mb-8 text-center">{title} - Ask Spark</h1>

        {/* Chat interface */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-full max-w-2xl min-h-[400px] flex flex-col bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
            {/* Example chat messages */}
            <div className="flex flex-col gap-4">
              {/* Bot message */}
              <div className="flex items-start gap-3">
                <div className="shrink-0"><AiIcon size={36} color="#3b82f6" /></div>
                <div className="bg-white border border-blue-100 rounded-xl px-4 py-3 text-blue-900 shadow-sm max-w-[80%]">
                  Hi! I'm Spark, your AI study assistant. How can I help you today?
                </div>
              </div>
              {/* User message */}
              <div className="flex items-start gap-3 justify-end flex-row-reverse">
                <div className="shrink-0">
                  <div className="h-9 w-9 rounded-full bg-blue-200 flex items-center justify-center font-bold text-blue-900">U</div>
                </div>
                <div className="bg-blue-600 text-white rounded-xl px-4 py-3 shadow max-w-[80%]">
                  Can you summarize Chapter 3 for me?
                </div>
              </div>
              {/* Bot message */}
              <div className="flex items-start gap-3">
                <div className="shrink-0"><AiIcon size={36} color="#3b82f6" /></div>
                <div className="bg-white border border-blue-100 rounded-xl px-4 py-3 text-blue-900 shadow-sm max-w-[80%]">
                  Absolutely! Here's a summary of Chapter 3: ...
                </div>
              </div>
            </div>
            {/* Input area placeholder */}
            <div className="mt-8 flex gap-2">
              <input type="text" className="flex-1 rounded-lg border border-blue-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" placeholder="Type your question..." disabled />
              <button className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold opacity-60 cursor-not-allowed">Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskSpark; 
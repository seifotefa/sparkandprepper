import React, { useRef } from 'react';

const NewStudyGuide = () => {
  const fileInputRef = useRef();

  const handleBoxClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[var(--color-prepper-blue-light)] py-8 px-2" style={{ fontFamily: 'Inter, Arial, sans-serif' }}>
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 border border-blue-100" style={{ boxShadow: '0 8px 32px 0 rgba(37,99,235,0.10)' }}>
        <h1 className="text-2xl font-bold mb-6" style={{ color: '#2563eb' }}>Upload Lecture Notes, Syllabus, Articles, etc.</h1>
        <form className="flex flex-col gap-6">
          <div>
            <label className="block text-blue-900 font-semibold mb-2">Upload PDF Files Only</label>
            <div
              className="flex flex-col items-center justify-center border-2 border-dashed border-blue-200 rounded-lg bg-blue-50 py-8 mb-2 cursor-pointer transition hover:bg-blue-100"
              onClick={handleBoxClick}
              tabIndex={0}
              role="button"
              aria-label="Upload PDF Files"
            >
              {/* Modern upload cloud icon */}
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M40 36V32C40 27.5817 36.4183 24 32 24C27.5817 24 24 27.5817 24 32V36" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M28 44V32" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M24 40L28 44L32 40" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="8" y="8" width="40" height="40" rx="12" stroke="#2563eb" strokeWidth="2"/>
              </svg>
              <span className="mt-3 text-blue-700 font-medium">Click or drag to upload PDF</span>
              <input
                type="file"
                accept="application/pdf"
                multiple
                ref={fileInputRef}
                className="hidden"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-2 px-6 py-2 rounded-lg font-semibold text-base shadow focus:outline-none focus:ring-2 transition-colors duration-200 border border-blue-200 bg-white text-[var(--color-prepper-blue)] hover:bg-blue-50"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewStudyGuide; 
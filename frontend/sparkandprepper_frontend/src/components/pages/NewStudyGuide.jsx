import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NewStudyGuide = () => {
  const fileInputRef = useRef();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [progress, setProgress] = useState({ status: '', percent: 0 });

  const handleBoxClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert('Please select a PDF file');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      alert('Please select a PDF file first');
      return;
    }

    setIsProcessing(true);
    setProgress({ status: 'Uploading file...', percent: 10 });

    const formData = new FormData();
    formData.append('pdf', selectedFile);

    try {
      setProgress({ status: 'Processing PDF...', percent: 30 });
      const response = await fetch('/api/process-pdf', { method: 'POST', body: formData });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Processing failed: ${errorData}`);
      }

      setProgress({ status: 'Generating study materials...', percent: 60 });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to process PDF');
      }

      // ✅ NEW → store as array of study guides
      const newGuide = {
        fileName: selectedFile.name,
        studyGuide: data.studyGuide,
        mockExam: data.mockExam,
        cheatSheet: data.cheatSheet,
        flashcards: data.flashcards,
        timestamp: new Date().toISOString(),
      };

      const existing = JSON.parse(localStorage.getItem('allStudyGuides') || '[]');
      const updated = [...existing, newGuide];

      localStorage.setItem('allStudyGuides', JSON.stringify(updated));
      localStorage.setItem('currentStudyGuide', JSON.stringify(newGuide));

      setProgress({ status: 'Complete!', percent: 100 });
      navigate('/dashboard');

    } catch (error) {
      console.error('❌ Processing error:', error);
      alert('Failed to process PDF. Please try again.');
      setProgress({ status: 'Error', percent: 0 });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[var(--color-prepper-blue-light)] py-8 px-2">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
        <h1 className="text-2xl font-bold mb-6" style={{ color: '#2563eb' }}>Upload Notes to Generate Study Guide</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-blue-900 font-semibold mb-2">Upload PDF Files Only</label>
            <div
              className="flex flex-col items-center justify-center border-2 border-dashed border-blue-200 rounded-lg bg-blue-50 py-8 mb-2 cursor-pointer transition hover:bg-blue-100"
              onClick={handleBoxClick}
            >
              <span className="text-blue-700 font-medium">
                {selectedFile ? selectedFile.name : 'Click or drag to upload PDF'}
              </span>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="application/pdf" className="hidden" />
            </div>
            {selectedFile && <p className="text-sm text-blue-600 mt-2">Selected file: {selectedFile.name}</p>}
          </div>
          {isProcessing && progress.status && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress.percent}%` }}></div>
              <p className="text-sm text-blue-600 mt-2">{progress.status}</p>
            </div>
          )}
          <button
            type="submit"
            disabled={isProcessing || !selectedFile}
            className={`mt-2 px-6 py-2 rounded-lg font-semibold text-base shadow focus:outline-none focus:ring-2 transition-colors duration-200 
              ${isProcessing || !selectedFile ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            {isProcessing ? 'Processing...' : 'Generate Study Guide'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewStudyGuide;

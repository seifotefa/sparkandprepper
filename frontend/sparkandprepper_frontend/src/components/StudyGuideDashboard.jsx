import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const icons = { StudyGuide: '📄', MockExam: '✅', CheatSheet: '📋', FlashCards: '🃏' };

// 🟢 Chatbot inline component
const Chatbot = ({ context }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ask-gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input, context }),
      });
      const data = await res.json();
      const botMsg = { sender: 'bot', text: data.answer || 'No answer found.' };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Error fetching answer.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow border border-blue-200 flex flex-col h-[400px]">
      <h3 className="text-lg font-bold text-blue-700 p-3 border-b border-blue-100">💬 Study Guide Chatbot</h3>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded max-w-[90%] ${
              msg.sender === 'user'
                ? 'bg-blue-100 text-blue-800 self-end'
                : 'bg-gray-100 text-gray-800 self-start'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex p-3 border-t border-blue-100 gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="Ask a question..."
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
        >
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

const StudyGuideDashboard = () => {
  const { title } = useParams();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('guide');
  const [studyMaterials, setStudyMaterials] = useState(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const materials = localStorage.getItem('currentStudyGuide');
    if (materials) {
      setStudyMaterials(JSON.parse(materials));
    }
  }, []);

  const renderBoxContent = () => {
    if (!studyMaterials) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold text-blue-700 mb-4">No Study Guide Found</h2>
          <p className="text-blue-600">Please generate a new study guide first.</p>
          <button
            onClick={() => navigate('/new-study-guide')}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Create New Study Guide
          </button>
        </div>
      );
    }

    const urlMap = {
      guide: studyMaterials.studyGuide,
      exam: studyMaterials.mockExam,
      cheatsheet: studyMaterials.cheatSheet,
    };

    const titleMap = {
      guide: studyMaterials.fileName + ' Study Guide',
      exam: 'Mock Exam',
      cheatsheet: 'Cheat Sheet',
    };

    if (['guide', 'exam', 'cheatsheet'].includes(selectedTab)) {
      return (
        <div className="w-full h-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-blue-700">{titleMap[selectedTab]}</h2>
            <a
              href={urlMap[selectedTab]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Download PDF
            </a>
          </div>
          <div
            className="bg-white rounded-lg shadow border border-blue-100 overflow-hidden"
            style={{ height: '75vh' }}
          >
            <iframe
              src={urlMap[selectedTab]}
              title={`${titleMap[selectedTab]} PDF`}
              width="100%"
              height="100%"
              style={{ border: 'none' }}
            />
          </div>
        </div>
      );
    }

    if (selectedTab === 'cards') {
      const flashcards = studyMaterials.flashcards.split('\n\n').filter(c => c.trim());
      const currentCard = flashcards[cardIndex];
      const [question, answer] = currentCard ? currentCard.split('\nA: ') : ['', ''];
      return (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">Flash Cards</h2>
          <div
            className="w-full max-w-lg min-h-[200px] bg-blue-600 text-white p-6 rounded-lg shadow border border-blue-100 cursor-pointer mb-4"
            onClick={() => setFlipped(!flipped)}
          >
            <div className="text-center">
              <p className="text-lg font-semibold mb-2">
                {flipped ? answer : question.replace('Q: ', '')}
              </p>
              <p className="text-sm text-blue-200">(Click to flip)</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              className="px-4 py-2 bg-blue-100 text-blue-800 rounded disabled:opacity-50"
              onClick={() => { setCardIndex(i => Math.max(0, i - 1)); setFlipped(false); }}
              disabled={cardIndex === 0}
            >
              Previous
            </button>
            <button
              className="px-4 py-2 bg-blue-100 text-blue-800 rounded disabled:opacity-50"
              onClick={() => { setCardIndex(i => Math.min(flashcards.length - 1, i + 1)); setFlipped(false); }}
              disabled={cardIndex === flashcards.length - 1}
            >
              Next
            </button>
          </div>
          <p className="mt-2 text-blue-600">
            Card {cardIndex + 1} of {flashcards.length}
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <div
      className="min-h-screen flex items-start justify-center bg-[var(--color-prepper-blue-light)] py-8 px-2"
      style={{ fontFamily: 'Inter, Arial, sans-serif' }}
    >
      <div
        className="w-full max-w-7xl bg-white rounded-2xl shadow-xl p-6 md:p-10 flex flex-col lg:flex-row justify-center gap-8 border border-blue-100"
        style={{ boxShadow: '0 8px 32px 0 rgba(37,99,235,0.10)' }}
      >
        <div className="flex-1 flex flex-col items-start justify-start min-h-[600px] overflow-y-auto">
          {renderBoxContent()}
        </div>

        <div className="flex flex-col gap-4 w-full max-w-xs lg:w-80">
          {['guide', 'exam', 'cheatsheet', 'cards'].map(tab => (
            <button
              key={tab}
              className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow transition-colors duration-200 flex items-center gap-3 ${
                selectedTab === tab
                  ? 'bg-blue-700 border-blue-700'
                  : 'bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700'
              }`}
              onClick={() => setSelectedTab(tab)}
            >
              {icons[tab === 'guide' ? 'StudyGuide' : tab === 'exam' ? 'MockExam' : tab === 'cards' ? 'FlashCards' : 'CheatSheet']}{' '}
              {tab === 'guide' ? 'Study Guide' : tab === 'exam' ? 'Mock Exam' : tab === 'cheatsheet' ? 'Cheat Sheet' : 'Flash Cards'}
            </button>
          ))}

          {/* 🟢 Embedded Chatbot */}
          {studyMaterials && <Chatbot context={`Study Guide:\n${studyMaterials.studyGuide}`} />}
        </div>
      </div>
    </div>
  );
};

export default StudyGuideDashboard;

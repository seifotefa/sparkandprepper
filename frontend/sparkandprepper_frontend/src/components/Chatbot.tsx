import React, { useState } from 'react';

const Chatbot = ({ context }) => {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! Ask me anything about your study guide.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { from: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ask-gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input.trim(), context })
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, { from: 'bot', text: data.answer }]);
      } else {
        setMessages(prev => [...prev, { from: 'bot', text: 'Sorry, I couldn\'t answer.' }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { from: 'bot', text: 'Error communicating with AI.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="flex flex-col w-full max-w-md bg-white shadow-lg rounded-lg p-4 border border-blue-100">
      <h3 className="text-lg font-bold text-blue-700 mb-2">💬 Study Guide Chatbot</h3>
      <div className="flex-1 overflow-y-auto max-h-64 mb-2 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`px-3 py-2 rounded-lg text-sm ${
              msg.from === 'user' ? 'bg-blue-100 text-blue-900 self-end' : 'bg-gray-100 text-gray-800'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Ask a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className={`px-4 py-2 rounded-lg text-white font-semibold ${
            loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;

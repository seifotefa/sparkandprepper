import React from 'react';
import { useNavigate } from 'react-router-dom';

const icons = {
  Biology: '🧬',
  'World History': '🌍',
  'Computer Science': '💻',
  Psychology: '🧠',
  Statistics: '📊',
};

const StudyCard = ({ title, date }) => {
  const navigate = useNavigate();
  return (
    <div
      className="bg-gray-800 text-white p-6 rounded-xl shadow-md flex flex-col gap-2 hover:scale-105 hover:shadow-xl transition-transform duration-200 cursor-pointer"
      onClick={() => navigate(`/study/${encodeURIComponent(title)}`)}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">{icons[title] || '📚'}</span>
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      <p className="text-sm text-gray-300">{date}</p>
    </div>
  );
};

export default StudyCard;

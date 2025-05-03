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
      className="p-6 rounded-lg shadow-lg flex flex-col gap-2 hover:scale-105 hover:shadow-2xl transition-transform duration-200 cursor-pointer border border-blue-100"
      style={{ fontFamily: 'Nunito, Inter, Arial, sans-serif', background: 'var(--color-prepper-blue-light)', borderLeft: '6px solid var(--color-prepper-blue)', boxShadow: '0 4px 16px 0 rgba(37,99,235,0.10)' }}
      onClick={() => navigate(`/study/${encodeURIComponent(title)}`)}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl" style={{ color: 'var(--color-prepper-blue)' }}>{icons[title] || '📚'}</span>
        <h2 className="text-xl font-bold" style={{ color: 'var(--color-prepper-blue)' }}>{title}</h2>
      </div>
      <p className="text-sm text-gray-500">{date}</p>
    </div>
  );
};

export default StudyCard;

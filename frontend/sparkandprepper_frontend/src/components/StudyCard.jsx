import React from 'react';

const icons = {
  Biology: '🧬',
  'World History': '🌍',
  'Computer Science': '💻',
  Psychology: '🧠',
  Statistics: '📊',
};

const StudyCard = ({ title, date, onClick }) => {
  return (
    <div
      className="p-6 rounded-lg shadow-lg flex flex-col gap-2 hover:scale-105 hover:shadow-2xl transition-transform duration-200 cursor-pointer border border-blue-100"
      style={{
        fontFamily: 'Nunito, Inter, Arial, sans-serif',
        background: 'var(--color-prepper-blue-light)',
        borderLeft: '6px solid var(--color-prepper-blue)',
        boxShadow: '0 4px 16px 0 rgba(37,99,235,0.10)',
      }}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 mb-2">
        <span
          className="text-3xl shrink-0"
          style={{ color: 'var(--color-prepper-blue)' }}
        >
          {icons[title] || '📚'}
        </span>
        <div className="flex-1 overflow-hidden">
          <h2
            className="text-xl font-bold whitespace-nowrap overflow-ellipsis overflow-hidden"
            style={{ color: 'var(--color-prepper-blue)' }}
            title={title}
          >
            {title}
          </h2>
        </div>
      </div>
      <p className="text-sm text-gray-500">{date}</p>
    </div>
  );
};

export default StudyCard;

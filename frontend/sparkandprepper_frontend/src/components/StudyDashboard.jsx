import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StudyCard from './StudyCard';

const studies = [
  { title: 'Biology', date: '2 hours ago' },
  { title: 'World History', date: 'Yesterday' },
  { title: 'Computer Science', date: 'April 20, 2024' },
  { title: 'Psychology', date: 'April 18, 2024' },
  { title: 'Statistics', date: 'April 16, 2024' },
];

const howToSteps = [
  'Click "+ New Study Guide" to start a new guide.',
  'Open any study guide to view, edit, or use AI features.',
  'Use the search bar to quickly find your guides.',
  'Access flashcards, practice tests, and more from each guide.'
];

// ICON COMPONENTS (inline for now, but should be moved to src/components/icons/)
const DotsGridIcon = ({ size = 24, color = "#5B6478" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {[0, 1, 2].map(row =>
      [0, 1, 2].map(col => (
        <circle
          key={`${row}-${col}`}
          cx={6 + col * 6}
          cy={6 + row * 6}
          r="1.5"
          fill={color}
        />
      ))
    )}
  </svg>
);
const DashboardIcon = ({ size = 20, color = "#5B6478" }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <rect x="2" y="2" width="7" height="7" rx="2" fill={color} />
    <rect x="11" y="2" width="7" height="4" rx="2" fill={color} />
    <rect x="2" y="11" width="4" height="7" rx="2" fill={color} />
    <rect x="8" y="11" width="10" height="7" rx="2" fill={color} />
  </svg>
);
const GuideIcon = ({ size = 20, color = "#5B6478" }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <rect x="3" y="3" width="14" height="14" rx="2" fill={color} />
    <rect x="6" y="6" width="8" height="2" rx="1" fill="#fff" />
    <rect x="6" y="10" width="5" height="2" rx="1" fill="#fff" />
  </svg>
);
const SupportIcon = ({ size = 20, color = "#5B6478" }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="8" stroke={color} strokeWidth="2" fill="none" />
    <circle cx="10" cy="14" r="1" fill={color} />
    <rect x="9" y="7" width="2" height="4" rx="1" fill={color} />
  </svg>
);
const AccountIcon = ({ size = 20, color = "#5B6478" }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="7" r="3" fill={color} />
    <rect x="4" y="13" width="12" height="4" rx="2" fill={color} />
  </svg>
);
const LogoutIcon = ({ size = 20, color = "#5B6478" }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <rect x="3" y="4" width="8" height="12" rx="2" fill={color} />
    <path d="M13 10h4m0 0l-2-2m2 2l-2 2" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Replace SearchIcon SVG with a more modern, bold magnifying glass
const SearchIcon = ({ size = 20, color = "#93c5fd" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="7" stroke={color} strokeWidth="2.2" />
    <rect x="17" y="17" width="4" height="2" rx="1" transform="rotate(45 17 17)" fill={color} />
  </svg>
);

const sidebarItems = [
  { label: 'Dashboard', route: '/dashboard', type: 'nav', icon: DashboardIcon },
  { label: 'How to Guide', route: '#howto', type: 'modal', icon: GuideIcon },
  { label: 'Support', route: '#support', type: 'support', icon: SupportIcon },
  { label: 'Account', route: '#', type: 'nav', icon: AccountIcon },
];

const StudyDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showHowTo, setShowHowTo] = useState(true);
  const [search, setSearch] = useState('');
  const [showHowToModal, setShowHowToModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const filteredStudies = studies.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase())
  );

  const cards = [
    ...filteredStudies.map((study) => (
      <StudyCard key={study.title} title={study.title} date={study.date} />
    )),
    <div
      key="plus-card"
      onClick={() => navigate('/all-study-guides')}
      className="p-6 shadow-lg flex flex-col items-center justify-center gap-2 hover:bg-blue-100 hover:scale-105 hover:shadow-2xl transition-transform duration-200 cursor-pointer min-h-[120px] border border-blue-200 bg-white rounded-lg"
      style={{ color: 'var(--color-prepper-blue)', boxShadow: '0 4px 16px 0 rgba(37,99,235,0.10)' }}
      title="View All Study Guides"
    >
      <span className="text-4xl font-bold mb-2">+</span>
      <span className="font-semibold">View All</span>
    </div>
  ];

  return (
    <div className="flex items-center justify-center py-8 px-2" style={{ fontFamily: 'Inter, Arial, sans-serif' }}>
      <div className="w-full max-w-5xl rounded-lg shadow-2xl p-8 md:p-12 bg-white border border-blue-100" style={{ boxShadow: '0 8px 32px 0 rgba(37,99,235,0.10)', fontFamily: 'Inter, Arial, sans-serif' }}>
        {/* How-to Guide Card */}
        {showHowTo && (
          <div className="mb-8 p-6 rounded-lg border border-blue-100 bg-blue-50 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm relative">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-lg text-blue-900">Learn how Spark and Prepper can help you</span>
              </div>
              <ul className="list-disc pl-5 text-sm text-blue-800 opacity-90">
                {howToSteps.map((step, i) => <li key={i}>{step}</li>)}
              </ul>
            </div>
            <button
              className="absolute top-3 right-3 text-blue-800 hover:text-blue-600 text-xl font-bold focus:outline-none"
              onClick={() => setShowHowTo(false)}
              aria-label="Dismiss How To Guide"
            >
              ×
            </button>
          </div>
        )}
        {/* How-to Guide Modal */}
        {showHowToModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white rounded-lg shadow-2xl p-8 max-w-lg w-full border border-blue-100 relative" style={{fontFamily: 'Inter, Arial, sans-serif'}}>
              <h2 className="text-xl font-bold mb-4 text-blue-900">How to use Spark and Prepper</h2>
              <ol className="list-decimal pl-6 text-blue-900 mb-6">
                <li>Click <b>+ New Study Guide</b> to start a new guide.</li>
                <li>Open any study guide to view, edit, or use AI features.</li>
                <li>Use the search bar to quickly find your guides.</li>
                <li>Access flashcards, practice tests, and more from each guide.</li>
                <li>Explore the dashboard for tips, tricks, and updates!</li>
              </ol>
              <button
                className="absolute top-3 right-3 text-blue-400 hover:text-blue-600 text-xl font-bold focus:outline-none"
                onClick={() => setShowHowToModal(false)}
                aria-label="Close How To Guide"
              >
                ×
              </button>
            </div>
          </div>
        )}
        {/* Support Modal */}
        {showSupportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white rounded-lg shadow-2xl p-8 max-w-lg w-full border border-blue-100 relative" style={{fontFamily: 'Inter, Arial, sans-serif'}}>
              <h2 className="text-xl font-bold mb-4 text-blue-900">Support & Help</h2>
              <ul className="list-disc pl-6 text-blue-900 mb-6">
                <li>For technical issues, please contact <a href="mailto:support@sparkandprepper.com" className="text-blue-600 underline">support@sparkandprepper.com</a></li>
                <li>Check our FAQ for common questions and troubleshooting.</li>
                <li>Feedback and suggestions are always welcome!</li>
              </ul>
              <button
                className="absolute top-3 right-3 text-blue-400 hover:text-blue-600 text-xl font-bold focus:outline-none"
                onClick={() => setShowSupportModal(false)}
                aria-label="Close Support"
              >
                ×
              </button>
            </div>
          </div>
        )}
        {/* Search and New Study Guide Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h1 className="text-2xl font-bold tracking-tight" style={{fontFamily: 'Inter, Arial, sans-serif', color: 'var(--color-prepper-blue)'}}>Recent Study Guides</h1>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-stretch md:items-center">
            <div className="relative w-full sm:w-64">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <SearchIcon size={20} color="#93c5fd" />
              </span>
              <input
                type="text"
                placeholder="Search study guides..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-blue-100 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200 text-base text-blue-900 placeholder-blue-300 w-full"
                style={{fontFamily: 'Inter, Arial, sans-serif'}}
              />
            </div>
            <button
              className="px-6 py-2 rounded-lg font-semibold text-base shadow focus:outline-none focus:ring-2 transition-colors duration-200 border border-blue-200"
              style={{
                background: 'var(--color-prepper-blue)',
                color: 'var(--color-white)',
                fontFamily: 'Inter, Arial, sans-serif',
                boxShadow: '0 2px 8px 0 rgba(37,99,235,0.10)'
              }}
              onClick={() => navigate('/new-study-guide')}
            >
              + New Study Guide
            </button>
          </div>
        </div>
        <hr className="mb-6 border-blue-100" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards}
        </div>
      </div>
    </div>
  );
};

export default StudyDashboard;

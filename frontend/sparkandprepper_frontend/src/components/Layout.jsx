import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ICON COMPONENTS
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

const sidebarItems = [
  { label: 'Dashboard', route: '/dashboard', type: 'nav', icon: DashboardIcon },
  { label: 'How to Guide', route: '#howto', type: 'modal', icon: GuideIcon },
  { label: 'Support', route: '#support', type: 'support', icon: SupportIcon },
  { label: 'Account', route: '#', type: 'nav', icon: AccountIcon },
];

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showHowToModal, setShowHowToModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex bg-[var(--color-prepper-blue-light)] font-sans" style={{fontFamily: 'Inter, Arial, sans-serif'}}>
      {/* Sidebar */}
      <aside className={`hidden md:flex flex-col min-h-full bg-white border-r border-blue-100 shadow-sm justify-between transition-all duration-200 fixed top-0 left-0 h-full z-40 ${sidebarOpen ? 'w-56 py-8 px-4 gap-1' : 'w-14 py-4 px-0 gap-0'}`}>
        <div>
          <button
            className={`mb-6 flex items-center justify-center w-10 h-10 rounded transition-colors duration-150 ${sidebarOpen ? 'mx-auto' : ''} hover:bg-blue-50 focus:outline-none`}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <DotsGridIcon size={28} color="#5B6478" />
          </button>
          {sidebarOpen && sidebarItems.map(item => (
            <button
              key={item.label}
              onClick={() => {
                if (item.type === 'nav' && item.route !== '#') navigate(item.route);
                if (item.type === 'modal') setShowHowToModal(true);
                if (item.type === 'support') setShowSupportModal(true);
              }}
              className={`flex items-center px-4 py-3 rounded-lg text-base font-medium text-blue-900 hover:bg-blue-50 transition-colors duration-150 w-full text-left focus:bg-blue-100 focus:outline-none`}
              style={{fontFamily: 'Inter, Arial, sans-serif'}}
            >
              {item.icon && <item.icon size={20} color="#5B6478" />}
              {sidebarOpen && <span className="ml-3">{item.label}</span>}
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-200 ${sidebarOpen ? 'md:ml-56' : 'md:ml-14'}`}>
        {children}
      </div>

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
    </div>
  );
};

export default Layout; 
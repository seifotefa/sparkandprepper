import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LogoutIcon = ({ size = 20, color = "#5B6478" }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <rect x="3" y="4" width="8" height="12" rx="2" fill={color} />
    <path d="M13 10h4m0 0l-2-2m2 2l-2 2" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BackArrowIcon = ({ size = 24, color = "#5B6478" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M15 19l-7-7 7-7" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setCanGoBack(window.history.length > 1);
  }, []);

  const handleHomeClick = (e) => {
    e.preventDefault();
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    setDropdownOpen(false);
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container-custom">
        <div className="flex justify-between items-center h-20 py-2">
          <div className="flex items-center space-x-3">
            {location.pathname !== '/dashboard' && location.pathname !== '/login' && location.pathname !== '/' && (
              <button
                onClick={() => window.history.back()}
                className="mr-2 p-2 rounded-full hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="Go back"
              >
                <BackArrowIcon size={24} color="#5B6478" />
              </button>
            )}
            <a href={user ? "/dashboard" : "/"} onClick={handleHomeClick} className="flex items-center gap-2 cursor-pointer select-none">
              <img src="/src/assets/logo.png" alt="Logo" className="h-12 w-auto drop-shadow-lg -mt-2 ml-2" />
              <div className="flex items-center text-2xl font-extrabold" style={{fontFamily: 'Inter, Arial, sans-serif'}}>
                <span className="text-yellow-500">Spark</span>
                <span className="text-black ml-1">and</span>
                <span className="text-blue-600 ml-1">Prep</span>
                <span className="text-black">per</span>
              </div>
            </a>
          </div>

          <div className="flex-1 flex justify-center">
            {/* Centered space for future nav or just centering */}
          </div>

          <div className="flex items-center space-x-4 justify-end mr-6">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((open) => !open)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <img
                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                    alt="Profile"
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="text-gray-800 font-semibold">{user.name}</span>
                  <svg className="w-4 h-4 ml-1 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-2 z-50 border">
                    <button
                      onClick={() => setShowLogoutConfirm(true)}
                      className="block w-full text-left px-4 py-2 text-gray-700 rounded-lg hover:bg-blue-50 transition-colors font-medium flex items-center gap-2"
                    >
                      <LogoutIcon size={18} color="#5B6478" />
                      Logout
                    </button>
                  </div>
                )}
                {showLogoutConfirm && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full border border-blue-200 relative" style={{ fontFamily: 'Inter, Arial, sans-serif' }}>
                      <h2 className="text-xl font-bold mb-4 text-[var(--color-prepper-blue)]">Log Out</h2>
                      <p className="mb-6 text-[var(--color-prepper-blue)]">
                        Are you sure you want to log out from <span className="font-bold text-blue-700">{user?.email}</span>?
                      </p>
                      <div className="flex justify-end gap-3">
                        <button
                          className="px-5 py-2 rounded-lg border border-blue-200 bg-white text-[var(--color-prepper-blue)] font-semibold hover:bg-blue-50 transition"
                          onClick={() => setShowLogoutConfirm(false)}
                        >
                          Cancel
                        </button>
                        <button
                          className="px-5 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"
                          onClick={handleLogout}
                        >
                          Log Out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-6 py-2 text-blue-600 border-2 border-blue-600 rounded-full hover:bg-blue-50 transition-colors duration-200"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

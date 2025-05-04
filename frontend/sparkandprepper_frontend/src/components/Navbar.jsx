import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const LogoutIcon = ({ size = 20, color = "#5B6478" }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <rect x="3" y="4" width="8" height="12" rx="2" fill={color} />
    <path d="M13 10h4m0 0l-2-2m2 2l-2 2" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const logout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2">
            <img src="/src/assets/logo.png" alt="Logo" className="h-10 w-auto" />
            <div className="text-2xl font-extrabold">
              <span className="text-yellow-500">Spark</span>
              <span className="text-black ml-1">and</span>
              <span className="text-blue-600 ml-1">Prepper</span>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((open) => !open)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none"
                >
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                    alt="Avatar"
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="font-medium text-gray-800">{user.name}</span>
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border z-50 py-2">
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 flex items-center gap-2"
                    >
                      <LogoutIcon size={18} />
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-6 py-2 text-blue-600 border-2 border-blue-600 rounded-full hover:bg-blue-50 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
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

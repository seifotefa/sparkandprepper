import React from 'react';

const Layout = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const logout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div>
      
      <main>{children}</main>
    </div>
  );
};

export default Layout;

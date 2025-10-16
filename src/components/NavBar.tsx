import React from 'react';

const NavBar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="font-display text-2xl font-bold text-kultrip-purple">
            Kultrip
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

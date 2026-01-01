import React from 'react';
import '../styles/Navbar.css'; // Importing the style specific to this block

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        Code <span className="highlight">RED</span>
      </div>
      
      {/* These will eventually be links to other pages */}
      <ul className="navbar-links">
        <li>Find a Salon</li>
        <li>Style Library</li>
      </ul>

      <button className="login-btn">
        Login
      </button>
    </nav>
  );
};

export default Navbar;
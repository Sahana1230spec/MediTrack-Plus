import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <div className="logo-icon">
            <span className="pill-icon">💊</span>
          </div>
          <span className="logo-text">MediTrack+</span>
        </Link>
        
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link 
            to="/" 
            className={`navbar-link ${isActive('/') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            <span className="link-icon">📊</span>
            Dashboard
          </Link>
          <Link 
            to="/logs" 
            className={`navbar-link ${isActive('/logs') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            <span className="link-icon">📋</span>
            Logs
          </Link>
          <Link 
            to="/users" 
            className={`navbar-link ${isActive('/users') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            <span className="link-icon">👥</span>
            Users
          </Link>
        </div>

        <div className="navbar-toggle" onClick={toggleMenu}>
          <span className={`toggle-bar ${isMenuOpen ? 'active' : ''}`}></span>
          <span className={`toggle-bar ${isMenuOpen ? 'active' : ''}`}></span>
          <span className={`toggle-bar ${isMenuOpen ? 'active' : ''}`}></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
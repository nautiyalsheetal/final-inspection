import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCog, FaUserCircle } from 'react-icons/fa';
import quadstation from '../assets/quadstation.png';
import './navbar.css';

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/'); // Redirect to login page
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="navbar">
      <div className="navbar-left">
        <h1 className="navbar-logo">
          Aut <FaCog className="gear-icon" /> sys
        </h1>
      </div>

      <div className="center">
        <img src={quadstation} alt="Quad Station" className="logo-image" />
      </div>

      <div className="navbar-right" ref={dropdownRef}>
        <div className="profile-icon" onClick={() => setShowDropdown(!showDropdown)}>
          <FaUserCircle size={30} />
          {showDropdown && (
            <div className="dropdown">
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../firebase';
import '../styles/Nav.css';
import logo from '../assets/icons8-soccer-50.png';

function Nav() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <nav className="nav">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <img src={logo} alt="LastManStanding Logo" />
          LastManStanding
        </Link>
        <button className="nav-toggle" onClick={toggleNav}>
          ☰
        </button>
        <div className={`nav-links ${isNavOpen ? 'active' : ''}`}>
          <Link to="/join" className="nav-link" onClick={toggleNav}>Join Competition</Link>
          <Link to="/competition" className="nav-link" onClick={toggleNav}>View Competition</Link>
          <Link to="/rules" className="nav-link" onClick={toggleNav}>Rules</Link>
          {currentUser && <Link to="/admin" className="nav-link" onClick={toggleNav}>Admin</Link>}
        </div>
        <div className={`nav-auth ${isNavOpen ? 'active' : ''}`}>
          {currentUser ? (
            <button onClick={() => { handleLogout(); toggleNav(); }} className="nav-button">Logout</button>
          ) : (
            <>
              <Link to="/login" className="nav-button" onClick={toggleNav}>Login</Link>
              <Link to="/signup" className="nav-button" onClick={toggleNav}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Nav;
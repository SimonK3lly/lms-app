import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../firebase';
import '../styles/Nav.css';
import logo from '../assets/icons8-soccer-50.png';

function Nav() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <nav className="nav">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <img src={logo} alt="LastManStanding Logo" />
          LastManStanding
        </Link>
        <div className="nav-links">
          <Link to="/join" className="nav-link">Join Competition</Link>
          <Link to="/competition" className="nav-link">View Competition</Link>
          {currentUser && <Link to="/admin" className="nav-link">Admin</Link>}
        </div>
        <div className="nav-auth">
          {currentUser ? (
            <button onClick={handleLogout} className="nav-button">Logout</button>
          ) : (
            <>
              <Link to="/login" className="nav-button">Login</Link>
              <Link to="/signup" className="nav-button">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Nav;
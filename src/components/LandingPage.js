import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleCompetition = () => {
    navigate('/competition');
  };

  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1 className="landing-title">Last Man Standing</h1>
        <p className="landing-description">
          Join and manage Last Man Standing competitions with ease! Our app provides all the tools you need to host and participate in competitions, track your progress, and much more.
        </p>
        <button onClick={handleCompetition} className="landing-button">
          View Competition
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
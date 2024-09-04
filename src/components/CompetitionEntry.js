import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Competition.css';

function CompetitionEntry() {
  const [competitionId, setCompetitionId] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (competitionId.trim()) {
      navigate(`/competition/${competitionId}`);
    }
  };

  return (
    <div className="competition-entry-container">
      <h2 className="competition-entry-title">Enter Competition ID</h2>
      <form onSubmit={handleSubmit} className="competition-entry-form">
        <input
          type="text"
          value={competitionId}
          onChange={(e) => setCompetitionId(e.target.value)}
          placeholder="Enter Competition ID"
          className="competition-entry-input"
        />
        <button type="submit" className="competition-entry-button">Go to Competition</button>
      </form>
    </div>
  );
}

export default CompetitionEntry;
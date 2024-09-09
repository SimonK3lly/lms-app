import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import '../styles/JoinCompetition.css';

function JoinCompetition() {
  const [joinCode, setJoinCode] = useState('');
  const navigate = useNavigate();

  const handleJoinCompetition = useCallback(async (code) => {
    try {
      const competitionsRef = collection(db, 'competitions');
      const q = query(competitionsRef, where("joinCode", "==", code));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert('Invalid join code');
        return;
      }

      navigate(`/join/${code}`);
    } catch (e) {
      console.error('Error joining competition: ', e);
      alert('Error joining competition. Please try again.');
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleJoinCompetition(joinCode);
  };

  return (
    <div className="join-competition-container">
      <h2 className="join-competition-title">Join Competition</h2>
      <form onSubmit={handleSubmit} className="join-competition-form">
        <input
          type="text"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
          placeholder="Enter Join Code"
          className="join-competition-input"
          required
        />
        <button type="submit" className="join-competition-button">Join</button>
      </form>
    </div>
  );
}

export default JoinCompetition;
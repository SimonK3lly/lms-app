import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, setDoc, collection } from 'firebase/firestore';
import '../styles/CompetitionRegistration.css';

function CompetitionRegistration() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const competitionName = location.state?.competitionName || 'Competition';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const participantRef = doc(collection(db, `competitions/${id}/participants`));
      const participantId = participantRef.id; // Generate a unique ID
      await setDoc(participantRef, {
        name,
        email,
        isActive: true,
        participantId: participantId
      });

      // Send email with the selection link (you'll need to implement email sending)
      const selectionLink = `${window.location.origin}/selection/${id}/${participantId}`;
      console.log('Selection link:', selectionLink); // For testing purposes

      alert('Successfully joined the competition! Check your email for the selection link.');
      navigate(`/competition/${id}`);
    } catch (e) {
      console.error('Error registering for competition: ', e);
      alert('Error registering for competition. Please try again.');
    }
  };

  return (
    <div className="competition-registration-container">
      <h2 className="competition-registration-title">Join {competitionName}</h2>
      <form onSubmit={handleSubmit} className="competition-registration-form">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter Your Name"
          className="competition-registration-input"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Your Email"
          className="competition-registration-input"
          required
        />
        <button type="submit" className="competition-registration-button">Register</button>
      </form>
    </div>
  );
}

export default CompetitionRegistration;
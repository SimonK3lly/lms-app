import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { db } from '../firebase';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import emailjs from '@emailjs/browser';
import '../styles/CompetitionRegistration.css';

function CompetitionRegistration() {
  const { joinCode: urlJoinCode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [competitionId, setCompetitionId] = useState('');
  const [competitionName, setCompetitionName] = useState('');

  const joinCode = urlJoinCode || location.state?.joinCode;

  useEffect(() => {
    if (!joinCode) {
      console.error('Join code is undefined');
      alert('Invalid join code');
      navigate('/');
      return;
    }

    const fetchCompetitionDetails = async () => {
      try {
        const competitionsRef = collection(db, 'competitions');
        const q = query(competitionsRef, where("joinCode", "==", joinCode));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const competitionDoc = querySnapshot.docs[0];
          setCompetitionId(competitionDoc.id);
          setCompetitionName(competitionDoc.data().name);
        } else {
          alert('Invalid join code');
          navigate('/');
        }
      } catch (e) {
        console.error('Error fetching competition details:', e);
        alert('Error fetching competition details. Please try again.');
        navigate('/');
      }
    };

    fetchCompetitionDetails();
  }, [joinCode, navigate]);

  const sendWelcomeEmail = async (to_email, to_name, competition_name, competition_link, selection_link) => {
    const templateParams = {
      to_email,
      to_name,
      competition_name,
      competition_link,
      selection_link
    };

    try {
      const result = await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        templateParams,
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      );
      console.log('Welcome email sent successfully:', result.text);
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const participantRef = doc(collection(db, `competitions/${competitionId}/participants`));
      const participantId = participantRef.id;
      
      const competitionLink = `${window.location.origin}/competition/${competitionId}`;
      const selectionLink = `${window.location.origin}/selection/${competitionId}/${participantId}`;

      // Send welcome email first
      await sendWelcomeEmail(email, name, competitionName, competitionLink, selectionLink);

      // If email is sent successfully, add the user to the competition
      await setDoc(participantRef, {
        name,
        email,
        isActive: true,
        participantId: participantId
      });

      alert('Successfully joined the competition! Check your email for important links.');
      navigate(`/competition/${competitionId}`);
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
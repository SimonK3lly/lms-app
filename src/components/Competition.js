import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import '../styles/Competition.css';

function Competition() {
  const { id } = useParams();
  const [competition, setCompetition] = useState(null);
  const [selection, setSelection] = useState('');
  const [deadline, setDeadline] = useState(null);

  useEffect(() => {
    const fetchCompetition = async () => {
      const docRef = doc(db, 'competitions', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCompetition(data);
        const gameweekRef = doc(db, `competitions/${id}/gameweeks/${data.currentGameweek}`);
        const gameweekSnap = await getDoc(gameweekRef);
        if (gameweekSnap.exists()) {
          setDeadline(gameweekSnap.data().deadline.toDate());
        }
      } else {
        console.log('No such document!');
      }
    };

    fetchCompetition();
  }, [id]);

  const handleSelection = async () => {
    if (new Date() > deadline) {
      alert('Deadline has passed. You cannot make or change your selection.');
      return;
    }

    try {
      await setDoc(doc(db, `competitions/${id}/participants/${auth.currentUser.uid}/selections/${competition.currentGameweek}`), {
        teamId: selection,
        result: null,
      });
      alert('Selection submitted successfully!');
    } catch (e) {
      console.error('Error submitting selection: ', e);
    }
  };

  if (!competition) return <div className="page-container"><div className="content-container">Loading...</div></div>;

  return (
    <div className="page-container">
      <div className="content-container">
        <h1 className="page-title">{competition.name} - Gameweek {competition.currentGameweek}</h1>
        <p className="competition-details">Deadline: {deadline ? deadline.toLocaleString() : 'Loading...'}</p>
        <select 
          className="form-input"
          onChange={(e) => setSelection(e.target.value)} 
          value={selection}
        >
          <option value="">Select a team</option>
          {/* Populate with teams, ensuring previously selected teams are not available */}
        </select>
        <button className="submit-button" onClick={handleSelection}>Submit Selection</button>
      </div>
    </div>
  );
}

export default Competition;
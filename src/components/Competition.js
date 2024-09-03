// src/components/Competition.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

function Competition() {
  const { id } = useParams();
  const [competition, setCompetition] = useState(null);
  const [selection, setSelection] = useState('');

  useEffect(() => {
    const fetchCompetition = async () => {
      const docRef = doc(db, 'competitions', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCompetition(docSnap.data());
      } else {
        console.log('No such document!');
      }
    };

    fetchCompetition();
  }, [id]);

  const handleSelection = async () => {
    const docRef = doc(db, 'competitions', id);
    await updateDoc(docRef, {
      selections: [...competition.selections, selection],
    });
  };

  return (
    <div>
      <h1>Competition {id}</h1>
      {competition && (
        <>
          <h2>{competition.name}</h2>
          <select onChange={(e) => setSelection(e.target.value)} value={selection}>
            <option value="">Select a team</option>
            {/* Replace with dynamic options */}
            <option value="team1">Team 1</option>
            <option value="team2">Team 2</option>
          </select>
          <button onClick={handleSelection}>Submit</button>
        </>
      )}
    </div>
  );
}

export default Competition;
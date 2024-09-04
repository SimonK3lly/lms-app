import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, updateDoc, doc, setDoc } from 'firebase/firestore';

function JoinCompetition() {
  const [joinCode, setJoinCode] = useState('');

  const handleJoinCompetition = async () => {
    try {
      const competitionsRef = collection(db, 'competitions');
      const q = query(competitionsRef, where("joinCode", "==", joinCode));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert('Invalid join code');
        return;
      }

      const competitionDoc = querySnapshot.docs[0];
      const competitionId = competitionDoc.id;

      // Add user to competition participants
      await setDoc(doc(db, `competitions/${competitionId}/participants/${auth.currentUser.uid}`), {
        name: auth.currentUser.displayName,
        email: auth.currentUser.email,
        isActive: true,
      });

      // Add competition to user's competitions
      await updateDoc(doc(db, `users/${auth.currentUser.uid}`), {
        [`competitions.${competitionId}`]: true,
      });

      alert('Successfully joined the competition!');
    } catch (e) {
      console.error('Error joining competition: ', e);
    }
  };

  return (
    <div>
      <h2>Join Competition</h2>
      <input
        type="text"
        placeholder="Enter Join Code"
        value={joinCode}
        onChange={(e) => setJoinCode(e.target.value)}
      />
      <button onClick={handleJoinCompetition}>Join</button>
    </div>
  );
}

export default JoinCompetition;
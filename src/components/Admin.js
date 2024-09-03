// src/components/Admin.js
import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

function Admin() {
  const [name, setName] = useState('');

  const handleCreateCompetition = async () => {
    try {
      const docRef = await addDoc(collection(db, 'competitions'), {
        name,
        selections: [],
      });
      alert(`Competition created with ID: ${docRef.id}`);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      <input
        type="text"
        placeholder="Competition Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleCreateCompetition}>Create Competition</button>
    </div>
  );
}

export default Admin;
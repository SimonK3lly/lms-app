import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { addDoc, collection, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import '../styles/Admin.css';

function Admin() {
  const [name, setName] = useState('');
  const [startGameweek, setStartGameweek] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [userCompetitions, setUserCompetitions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate('/login');
      } else {
        setIsLoading(false);
        fetchUserCompetitions(user.uid);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchUserCompetitions = async (userId) => {
    const q = query(collection(db, 'competitions'), where('adminId', '==', userId));
    const querySnapshot = await getDocs(q);
    const competitions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setUserCompetitions(competitions);
  };
  
  const handleCreateCompetition = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      alert('You must be logged in to create a competition');
      navigate('/login');
      return;
    }
  
    try {
      const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const docRef = await addDoc(collection(db, 'competitions'), {
        name,
        adminId: auth.currentUser.uid,
        startGameweek: parseInt(startGameweek),
        currentGameweek: parseInt(startGameweek), // You might want to keep this for other functionalities
        joinCode,
        status: 'active',
        createdAt: serverTimestamp(),
      });
      alert(`Competition created with ID: ${docRef.id} and Join Code: ${joinCode}`);
      setName('');
      setStartGameweek('');
      fetchUserCompetitions(auth.currentUser.uid);
    } catch (e) {
      console.error('Error adding document: ', e);
      alert('Error creating competition. Please try again.');
    }
  };

  if (isLoading) {
    return <div className="admin-container"><div className="admin-content">Loading...</div></div>;
  }

  return (
    <div className="admin-container">
      <div className="admin-content">
        <h1 className="admin-title">Admin Panel</h1>
        <form onSubmit={handleCreateCompetition} className="admin-form">
          <h2>Create New Competition</h2>
          <div className="form-group">
            <label htmlFor="competitionName">Competition Name</label>
            <input
              id="competitionName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter competition name"
              required
              className="admin-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="startGameweek">Start Gameweek</label>
            <select
              id="startGameweek"
              value={startGameweek}
              onChange={(e) => setStartGameweek(e.target.value)}
              required
              className="admin-input"
            >
              <option value="">Select Start Gameweek</option>
              {[...Array(38)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  Gameweek {i + 1}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="admin-button">Create Competition</button>
        </form>
        <div className="admin-competitions">
          <h2>Your Competitions</h2>
          {userCompetitions.length > 0 ? (
            <ul className="competition-list">
              {userCompetitions.map((competition) => (
                <li key={competition.id} className="competition-item">
                  <h3>{competition.name}</h3>
                  <p>Status: {competition.status}</p>
                  <p>Starting Gameweek: {competition.startGameweek}</p>
                  <p>Join Code: {competition.joinCode}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>You haven't created any competitions yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;
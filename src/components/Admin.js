import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { addDoc, collection, serverTimestamp, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import '../styles/Admin.css';
import { getCurrentMatchday } from '../api/footballData';

function Admin() {
  const [name, setName] = useState('');
  const [startGameweek, setStartGameweek] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [userCompetitions, setUserCompetitions] = useState([]);
  const [currentGameweek, setCurrentGameweek] = useState(null);
  const [allowedGameweeks, setAllowedGameweeks] = useState([]);
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

  useEffect(() => {
    const fetchGameweekAndFixtures = async () => {
      try {
        const matchday = await getCurrentMatchday();
        setCurrentGameweek(matchday);
        const allowed = Array.from({length: 5}, (_, i) => matchday + i);
        setAllowedGameweeks(allowed);
      } catch (error) {
        console.error('Error fetching gameweek and fixtures:', error);
      }
    };

    fetchGameweekAndFixtures();
  }, []);

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
        currentGameweek: parseInt(startGameweek),
        joinCode,
        status: 'active',
        createdAt: serverTimestamp(),
      });
      alert(`Competition created with ID: ${docRef.id} and Join Code: ${joinCode}`);
      setName('');
      setStartGameweek('');
      fetchUserCompetitions(auth.currentUser.uid);
      navigate(`/competition/${docRef.id}`);
    } catch (e) {
      console.error('Error adding document: ', e);
      alert('Error creating competition. Please try again.');
    }
  };

  const handleDeleteCompetition = async (competitionId) => {
    if (window.confirm('Are you sure you want to delete this competition?')) {
      try {
        await deleteDoc(doc(db, 'competitions', competitionId));
        setUserCompetitions(prevCompetitions => 
          prevCompetitions.filter(comp => comp.id !== competitionId)
        );
        alert('Competition deleted successfully');
      } catch (error) {
        console.error('Error deleting competition:', error);
        alert('Error deleting competition. Please try again.');
      }
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
              {allowedGameweeks.map((gw) => (
                <option key={gw} value={gw}>
                  Gameweek {gw} {gw === currentGameweek ? '(Upcoming)' : ''}
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
                  <div className="competition-header">
                    <h3>{competition.name}</h3>
                    <button 
                      onClick={() => handleDeleteCompetition(competition.id)}
                      className="delete-button"
                      aria-label="Delete competition"
                    >
                      🗑️
                    </button>
                  </div>
                  <p>Status: {competition.status}</p>
                  <p>Starting Gameweek: {competition.startGameweek}</p>
                  <p>Join Code: {competition.joinCode}</p>
                  <p>Join Link: {`${window.location.origin}/join/${competition.joinCode}`}</p>
                  <button
                    onClick={() => navigate(`/competition/${competition.id}`)}
                    className="view-button"
                  >
                    View
                  </button>
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
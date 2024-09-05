import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getFixturesForMatchday, getCurrentMatchday } from '../api/footballData';
import '../styles/SelectionPage.css';

function SelectionPage() {
  const { competitionId, userId } = useParams();
  const [fixtures, setFixtures] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [competitionName, setCompetitionName] = useState('');
  const [currentGameweek, setCurrentGameweek] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch competition data
        const competitionDoc = await getDoc(doc(db, 'competitions', competitionId));
        if (competitionDoc.exists()) {
          setCompetitionName(competitionDoc.data().name);
          setCurrentGameweek(competitionDoc.data().currentGameweek);
        }

        // Fetch user data
        const userDoc = await getDoc(doc(db, `competitions/${competitionId}/participants`, userId));
        if (userDoc.exists()) {
          setUserName(userDoc.data().name);
        }

        // Fetch fixtures for the current gameweek
        const matchday = await getCurrentMatchday();
        const fixturesData = await getFixturesForMatchday(matchday);
        setFixtures(fixturesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [competitionId, userId]);

  const handleTeamSelection = (teamId, teamName) => {
    setSelectedTeam({ id: teamId, name: teamName });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTeam) {
      alert('Please select a team before submitting.');
      return;
    }

    try {
      await setDoc(doc(db, `competitions/${competitionId}/participants/${userId}/selections`, currentGameweek.toString()), {
        teamId: selectedTeam.id,
        teamName: selectedTeam.name,
        gameweek: currentGameweek,
        timestamp: new Date()
      });

      alert('Your selection has been submitted successfully!');
    } catch (error) {
      console.error('Error submitting selection:', error);
      alert('There was an error submitting your selection. Please try again.');
    }
  };

  return (
    <div className="selection-page-container">
      <h1 className="selection-page-title">{competitionName} - Gameweek {currentGameweek}</h1>
      <h2 className="user-selection-title">{userName}'s Selection</h2>
      <form onSubmit={handleSubmit} className="selection-form">
        <div className="fixtures-container">
          {fixtures.map((fixture) => (
            <div key={fixture.id} className="fixture-item">
              <button
                type="button"
                className={`team-button ${selectedTeam?.id === fixture.homeTeam.id ? 'selected' : ''}`}
                onClick={() => handleTeamSelection(fixture.homeTeam.id, fixture.homeTeam.name)}
              >
                <img src={fixture.homeTeam.crest} alt={fixture.homeTeam.name} className="team-logo" />
                <span>{fixture.homeTeam.name}</span>
              </button>
              <span className="vs">vs</span>
              <button
                type="button"
                className={`team-button ${selectedTeam?.id === fixture.awayTeam.id ? 'selected' : ''}`}
                onClick={() => handleTeamSelection(fixture.awayTeam.id, fixture.awayTeam.name)}
              >
                <img src={fixture.awayTeam.crest} alt={fixture.awayTeam.name} className="team-logo" />
                <span>{fixture.awayTeam.name}</span>
              </button>
            </div>
          ))}
        </div>
        <div className="selection-summary">
          {selectedTeam && <p>You have selected: {selectedTeam.name}</p>}
          <button type="submit" className="submit-button" disabled={!selectedTeam}>
            Submit Selection
          </button>
        </div>
      </form>
    </div>
  );
}

export default SelectionPage;
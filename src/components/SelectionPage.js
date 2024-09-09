import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { getFixturesForMatchday } from '../api/footballData';
import '../styles/SelectionPage.css';

function SelectionPage() {
  const { competitionId, userId } = useParams();
  const [fixtures, setFixtures] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [competitionName, setCompetitionName] = useState('');
  const [currentGameweek, setCurrentGameweek] = useState(null);
  const [userName, setUserName] = useState('');
  const [previousSelections, setPreviousSelections] = useState([]);
  const [deadline, setDeadline] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch competition data
        const competitionDoc = await getDoc(doc(db, 'competitions', competitionId));
        if (competitionDoc.exists()) {
          const competitionData = competitionDoc.data();
          setCompetitionName(competitionData.name);
          setCurrentGameweek(competitionData.currentGameweek);

          // Fetch user data
          const userDoc = await getDoc(doc(db, `competitions/${competitionId}/participants`, userId));
          if (userDoc.exists()) {
            setUserName(userDoc.data().name);
          }

          // Fetch fixtures for the current gameweek
          const fixturesData = await getFixturesForMatchday(competitionData.currentGameweek);
          setFixtures(fixturesData);

          if (fixturesData.length > 0) {
            const firstFixtureDate = new Date(fixturesData[0].utcDate);
            const deadlineDate = new Date(firstFixtureDate);
            deadlineDate.setHours(deadlineDate.getHours() - 1);
            setDeadline(deadlineDate);
          } else {
            setDeadline(null);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setFixtures([]);  // Set fixtures to an empty array in case of error
      }
    };

    fetchData();
  }, [competitionId, userId]);

  useEffect(() => {
    const fetchPreviousSelections = async () => {
      const selectionsRef = collection(db, `competitions/${competitionId}/participants/${userId}/selections`);
      const selectionsSnapshot = await getDocs(selectionsRef);
      const allSelections = selectionsSnapshot.docs.map(doc => ({
        gameweek: parseInt(doc.id),
        teamId: doc.data().teamId,
        teamName: doc.data().teamName
      }));
      
      const previousSelections = allSelections.filter(selection => selection.gameweek < currentGameweek).map(selection => selection.teamId);
      setPreviousSelections(previousSelections);

      const currentSelection = allSelections.find(selection => selection.gameweek === currentGameweek);
      if (currentSelection) {
        setSelectedTeam({ id: currentSelection.teamId, name: currentSelection.teamName });
      }
    };

    if (currentGameweek) {
      fetchPreviousSelections();
    }
  }, [competitionId, userId, currentGameweek]);

  const handleTeamSelection = (teamId, teamName) => {
    if (previousSelections.includes(teamId)) {
      alert("You've already selected this team in a previous week.");
      return;
    }
    setSelectedTeam({ id: teamId, name: teamName });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const now = new Date();
    if (deadline && now >= deadline) {
      alert('The deadline for selections has passed.');
      return;
    }
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
      <h2 className="user-selection-title">{userName}</h2>
      <p className="current-selection">
        Current Selection: {selectedTeam ? selectedTeam.name : 'None'}
      </p>
      <form onSubmit={handleSubmit} className="selection-form">
        <div className="fixtures-container">
          {fixtures.map((fixture) => (
            <div key={fixture.id} className="fixture-item">
              <button
                type="button"
                className={`team-button ${selectedTeam?.id === fixture.homeTeam.id ? 'selected' : ''} ${previousSelections.includes(fixture.homeTeam.id) ? 'disabled' : ''}`}
                onClick={() => handleTeamSelection(fixture.homeTeam.id, fixture.homeTeam.name)}
                disabled={previousSelections.includes(fixture.homeTeam.id)}
              >
                <img src={fixture.homeTeam.crest} alt={fixture.homeTeam.name} className={`team-logo ${previousSelections.includes(fixture.homeTeam.id) ? 'greyed-out' : ''}`} />
                <span className={previousSelections.includes(fixture.homeTeam.id) ? 'greyed-out' : ''}>{fixture.homeTeam.name}</span>
              </button>
              <span className="vs">vs</span>
              <button
                type="button"
                className={`team-button ${selectedTeam?.id === fixture.awayTeam.id ? 'selected' : ''} ${previousSelections.includes(fixture.awayTeam.id) ? 'disabled' : ''}`}
                onClick={() => handleTeamSelection(fixture.awayTeam.id, fixture.awayTeam.name)}
                disabled={previousSelections.includes(fixture.awayTeam.id)}
              >
                <img src={fixture.awayTeam.crest} alt={fixture.awayTeam.name} className={`team-logo ${previousSelections.includes(fixture.awayTeam.id) ? 'greyed-out' : ''}`} />
                <span className={previousSelections.includes(fixture.awayTeam.id) ? 'greyed-out' : ''}>{fixture.awayTeam.name}</span>
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
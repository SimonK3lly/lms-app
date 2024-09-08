import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import '../styles/Competition.css';
import { getFixturesForMatchday, getCurrentMatchday } from '../api/footballData';

function Competition() {
  const { competitionId } = useParams();
  const [competition, setCompetition] = useState(null);
  const [deadline, setDeadline] = useState(null);
  const [fixtures, setFixtures] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchCompetitionAndFixtures = async () => {
      const docRef = doc(db, 'competitions', competitionId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCompetition(data);
        setIsAdmin(auth.currentUser && auth.currentUser.uid === data.adminId);
        const currentGameweek = await getCurrentMatchday();
        if (currentGameweek) {
          const fixturesData = await getFixturesForMatchday(currentGameweek);
          setFixtures(fixturesData);

          // Calculate deadline
          if (fixturesData.length > 0) {
            const firstFixtureDate = new Date(fixturesData[0].utcDate);
            const deadlineDate = new Date(firstFixtureDate);
            deadlineDate.setDate(deadlineDate.getDate() - 1);
            deadlineDate.setHours(22, 0, 0, 0);
            setDeadline(deadlineDate);
          } else {
            setDeadline(null);
          }
        }

        // Fetch participants
        const participantsRef = collection(db, `competitions/${competitionId}/participants`);
        const participantsSnapshot = await getDocs(participantsRef);
        const participantsData = participantsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setParticipants(participantsData);
      } else {
        console.log('No such document!');
      }
    };

    fetchCompetitionAndFixtures();
  }, [competitionId]);

  if (!competition) return <div className="page-container"><div className="content-container">Loading...</div></div>;

  return (
    <div className="page-container">
      <div className="content-container">
        <h1 className="page-title">{competition.name} - Gameweek {competition.currentGameweek}</h1>
        <p className="competition-details">Gameweek {competition.currentGameweek} Deadline: {deadline ? deadline.toLocaleString() : 'Loading...'}</p>
        
        {isAdmin && (
          <div className="admin-info">
            <p>Join Code: {competition.joinCode}</p>
            <p>Join Link: {`${window.location.origin}/join/${competition.joinCode}`}</p>
          </div>
        )}

        <h2>Fixtures</h2>
        <div className="fixtures-container">
          <ul className="competition-fixtures-list">
            {fixtures.map((fixture) => (
              <li key={fixture.id} className="competition-fixture-item">
                <div className="competition-teams-container">
                  <div className="competition-team home-team">
                    <img src={fixture.homeTeam.crest} alt={fixture.homeTeam.name} className="competition-team-logo" />
                    <span className="competition-team-name">{fixture.homeTeam.name}</span>
                  </div>
                  <span className="competition-vs">vs</span>
                  <div className="competition-team away-team">
                    <img src={fixture.awayTeam.crest} alt={fixture.awayTeam.name} className="competition-team-logo" />
                    <span className="competition-team-name">{fixture.awayTeam.name}</span>
                  </div>
                </div>
                <span className="competition-fixture-date">{new Date(fixture.utcDate).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>

        <h2>Participants ({participants.length})</h2>
        <ul className="participants-list">
          {participants.map((participant) => (
            <li key={participant.id} className="participant-item">
              <span className="participant-name">{participant.name}</span>
              {isAdmin && (
                <span className="participant-email">
                  {participant.email} (ID: {participant.id})
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Competition;
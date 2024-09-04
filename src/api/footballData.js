import axios from 'axios';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const API_KEY = process.env.REACT_APP_FOOTBALL_DATA_API_KEY;
const BASE_URL = '/v4';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'X-Auth-Token': API_KEY }
});

const LEAGUE_DOC_ID = 'PL'; // Premier League document ID

export const getCurrentMatchday = async () => {
  try {
    const leagueDoc = await getDoc(doc(db, 'leagueData', LEAGUE_DOC_ID));
    
    if (leagueDoc.exists() && leagueDoc.data().lastUpdated > Date.now() - 3600000) {
      // If data exists and is less than 1 hour old, use it
      return leagueDoc.data().currentMatchday;
    }

    // If data doesn't exist or is old, fetch from API
    const response = await api.get('/competitions/PL');
    const currentMatchday = response.data.currentSeason.currentMatchday;

    // Update the database
    await setDoc(doc(db, 'leagueData', LEAGUE_DOC_ID), {
      currentMatchday,
      lastUpdated: Date.now()
    }, { merge: true });

    return currentMatchday;
  } catch (error) {
    console.error('Error fetching current matchday:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getFixturesForMatchday = async (matchday) => {
  try {
    const leagueDoc = await getDoc(doc(db, 'leagueData', LEAGUE_DOC_ID));
    
    if (leagueDoc.exists() && leagueDoc.data().fixtures && leagueDoc.data().fixtures[matchday]) {
      return leagueDoc.data().fixtures[matchday];
    }

    const response = await api.get(`/competitions/PL/matches`, {
      params: { matchday }
    });

    if (!response.data || !response.data.matches) {
      console.error('Unexpected API response:', response.data);
      return [];
    }

    const sortedFixtures = response.data.matches.sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate));

    await setDoc(doc(db, 'leagueData', LEAGUE_DOC_ID), {
      [`fixtures.${matchday}`]: sortedFixtures,
      lastUpdated: Date.now()
    }, { merge: true });

    return sortedFixtures;
  } catch (error) {
    console.error('Error fetching fixtures:', error.response ? error.response.data : error.message);
    return [];
  }
};
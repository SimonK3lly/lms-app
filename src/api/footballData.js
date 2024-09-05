import axios from 'axios';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const BASE_URL = '/api';

const api = axios.create({
  baseURL: BASE_URL
});

const LEAGUE_DOC_ID = 'PL'; // Premier League document ID

export const getCurrentMatchday = async () => {
  try {
    const leagueDoc = await getDoc(doc(db, 'leagueData', LEAGUE_DOC_ID));
    
    if (leagueDoc.exists() && leagueDoc.data().lastUpdated > Date.now() - 3600000) {
      return leagueDoc.data().currentMatchday;
    }

    const response = await api.get('/competitions/PL');
    const currentMatchday = response.data.currentSeason.currentMatchday;

    await setDoc(doc(db, 'leagueData', LEAGUE_DOC_ID), {
      currentMatchday,
      lastUpdated: Date.now()
    }, { merge: true });

    return currentMatchday;
  } catch (error) {
    console.error('Error fetching current matchday:', error.message);
    return null;
  }
};

export const getFixturesForMatchday = async (matchday) => {
  if (!matchday) {
    console.error('Invalid matchday:', matchday);
    return [];
  }

  try {
    console.log('Fetching fixtures from API for matchday:', matchday);
    const response = await api.get(`/competitions/PL/matches?matchday=${matchday}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = response.data;
    return data.matches || [];
  } catch (error) {
    console.error('Error fetching fixtures:', error);
    return [];
  }
};

export const cacheFixtures = async (matchday, fixtures) => {
  try {
    await setDoc(doc(db, 'fixtures', `matchday_${matchday}`), { matches: fixtures });
  } catch (error) {
    console.error('Error caching fixtures:', error);
  }
};
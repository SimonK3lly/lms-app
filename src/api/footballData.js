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
    console.log('API Response:', response.data); // Log the entire response

    if (!response.data || !response.data.currentSeason) {
      console.error('Unexpected API response structure:', response.data);
      return null;
    }

    const currentMatchday = response.data.currentSeason.currentMatchday;

    if (!currentMatchday) {
      console.error('Unable to fetch current matchday from API');
      return null;
    }

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
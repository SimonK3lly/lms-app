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
  try {
    const fixturesDoc = await getDoc(doc(db, 'fixtures', `matchday_${matchday}`));
    if (fixturesDoc.exists()) {
      const cachedData = fixturesDoc.data();
      if (Date.now() - cachedData.lastUpdated < 3600000) { // 1 hour
        console.log('Using cached fixtures data');
        return cachedData.matches;
      }
    }

    console.log('Fetching fixtures from API for matchday:', matchday);
    
    const response = await api.get(`/competitions/PL/matches`, {
      params: { matchday }
    });
    const fixtures = response.data.matches;

    // Cache the new data
    await setDoc(doc(db, 'fixtures', `matchday_${matchday}`), {
      matches: fixtures,
      lastUpdated: Date.now()
    });

    return fixtures;
  } catch (error) {
    console.error('Error fetching fixtures:', error.message);
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
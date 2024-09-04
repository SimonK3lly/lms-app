import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import Competition from './components/Competition';
import CompetitionEntry from './components/CompetitionEntry';
import Login from './components/Login';
import Admin from './components/Admin';
import LandingPage from './components/LandingPage';
import SignUp from './components/SignUp';
import { AuthProvider } from './contexts/AuthContext';
import JoinCompetition from './components/JoinCompetition';
import CompetitionRegistration from './components/CompetitionRegistration';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/competition" element={<CompetitionEntry />} />
            <Route path="/competition/:id" element={<Competition />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/join" element={<JoinCompetition />} />
            <Route path="/join/:id" element={<CompetitionRegistration />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
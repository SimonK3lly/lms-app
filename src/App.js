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
import SelectionPage from './components/SelectionPage';
import ForgotPassword from './components/ForgotPassword';
import TermsOfService from './components/TermsOfService';
import PrivacyPolicy from './components/PrivacyPolicy';
import Rules from './components/Rules';

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
            <Route path="/competition/:competitionId" element={<Competition />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/join" element={<JoinCompetition />} />
            <Route path="/join/:competitionId" element={<CompetitionRegistration />} />
            <Route path="/selection/:competitionId/:userId" element={<SelectionPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/rules" element={<Rules />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
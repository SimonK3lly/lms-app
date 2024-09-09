import React, { useState } from 'react';
import { signUpWithEmailAndPassword } from '../firebase';
import GoogleSignInButton from './GoogleSignInButton';
import '../styles/Register.css';
import { Link } from 'react-router-dom';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [verificationSent, setVerificationSent] = useState(false);

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await signUpWithEmailAndPassword(email, password);
      setVerificationSent(true);
    } catch (error) {
      setError(error.message);
    }
  };

  if (verificationSent) {
    return (
      <div className="page-container">
        <div className="content-container">
          <h2 className="page-title">Verification Email Sent</h2>
          <p>Please check your email to verify your account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="content-container">
        <h2 className="page-title">Sign Up</h2>
        <form className="register-form" onSubmit={handleEmailSignUp}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="form-input"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="form-input"
          />
          <button type="submit" className="submit-button">Sign Up with Email</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <GoogleSignInButton />
        <p className="terms">
          By signing up, you agree to our <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
};

export default SignUp;
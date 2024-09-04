import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import GoogleSignInButton from './GoogleSignInButton';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Failed to log in. Please check your credentials and try again.');
    }
  };

  return (
    <div className="page-container">
      <div className="content-container">
        <h1 className="page-title">Login</h1>
        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            required
          />
          <button type="submit" className="submit-button">Login</button>
        </form>
        <GoogleSignInButton />
        <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
      </div>
    </div>
  );
}

export default Login;
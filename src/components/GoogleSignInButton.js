import React from 'react';
import { signInWithGoogle } from '../firebase';
import { useNavigate } from 'react-router-dom';
import '../styles/GoogleSignInButton.css';
import googleSignIn from '../assets/googleSignIn.jpg';

const GoogleSignInButton = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate('/admin');
    } catch (error) {
      console.error('Error signing in with Google', error);
      alert('Failed to sign in with Google. Please try again.');
    }
  };

  return (
    <button onClick={handleGoogleSignIn} className="google-sign-in-button">
      <img src={googleSignIn} alt="Google logo" />
      <span>Sign in with Google</span>
    </button>
  );
};

export default GoogleSignInButton;
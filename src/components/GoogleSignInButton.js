import React from 'react';
import { signInWithGoogle } from '../firebase';
import { useNavigate } from 'react-router-dom';

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
      Sign in with Google
    </button>
  );
};

export default GoogleSignInButton;
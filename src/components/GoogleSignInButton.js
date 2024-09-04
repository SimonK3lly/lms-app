import React, { useEffect, useRef } from 'react';
import { auth } from '../firebase';
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const GoogleSignInButton = () => {
  const buttonRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleCredentialResponse = async (response) => {
      if (response.credential) {
        try {
          const credential = GoogleAuthProvider.credential(response.credential);
          await signInWithCredential(auth, credential);
          navigate('/admin');
        } catch (error) {
          console.error('Error signing in with Google', error);
          alert('Failed to sign in with Google. Please try again.');
        }
      } else {
        console.error('No credential received from Google Sign-In');
        alert('Failed to sign in with Google. Please try again.');
      }
    };

    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: '811664410630-7fg7b4scipk7d8pdbo5kgaoo1rnqgnt7.apps.googleusercontent.com',
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(buttonRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular',
        logo_alignment: 'left',
      });
    } else {
      console.error('Google Sign-In SDK not loaded');
    }
  }, [navigate]);

  return <div ref={buttonRef}></div>;
};

export default GoogleSignInButton;
import React, { useEffect, useRef, useCallback } from 'react';
import { signInWithGoogle } from '../firebase';
import { useNavigate } from 'react-router-dom';

const GoogleSignInButton = () => {
  const buttonRef = useRef(null);
  const navigate = useNavigate();
  const isInitialized = useRef(false);

  const handleCredentialResponse = useCallback(async (response) => {
    if (response.credential) {
      try {
        await signInWithGoogle(response.credential);
        navigate('/admin');
      } catch (error) {
        console.error('Error signing in with Google', error);
        alert('Failed to sign in with Google. Please try again.');
      }
    } else {
      console.error('No credential received from Google Sign-In');
      alert('Failed to sign in with Google. Please try again.');
    }
  }, [navigate]);

  useEffect(() => {
    if (window.google && !isInitialized.current) {
      window.google.accounts.id.initialize({
        client_id: '811664410630-7fg7b4scipk7d8pdbo5kgaoo1rnqgnt7.apps.googleusercontent.com',
        callback: handleCredentialResponse,
      });
      isInitialized.current = true;
    }
  }, [handleCredentialResponse]);

  useEffect(() => {
    if (window.google && buttonRef.current && isInitialized.current) {
      window.google.accounts.id.renderButton(buttonRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular',
        logo_alignment: 'left',
      });
    }
  }, []);

  return <div ref={buttonRef}></div>;
};

export default GoogleSignInButton;
"use client";

import { GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './GoogleAuth.module.scss';

export function GoogleAuth({ mode = 'login' }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pendingGoogleData, setPendingGoogleData] = useState(null);

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setError('');

    try {
      // Decode the JWT token to get user info
      const token = credentialResponse.credential;
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      const googleData = {
        googleToken: token,
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
      };

      // First attempt without phone number
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(googleData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('genzla-token', data.token);
        localStorage.setItem('genzla-user', JSON.stringify(data.user));
        
        if (data.user.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/dashboard');
        }
      } else if (data.requiresPhone) {
        // New user needs to provide phone number
        setPendingGoogleData(googleData);
        setShowPhoneInput(true);
        setError('');
      } else {
        setError(data.message || 'Google authentication failed');
      }
    } catch (error) {
      console.error('Google auth error:', error);
      setError('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!phoneNumber.trim()) {
      setError('Phone number is required');
      setIsLoading(false);
      return;
    }

    // Validate phone number format
    const phoneRegex = /^[+]?[\d\s\-\(\)]{10,15}$/;
    if (!phoneRegex.test(phoneNumber.trim())) {
      setError('Please enter a valid phone number');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...pendingGoogleData,
            phone: phoneNumber.trim(),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('genzla-token', data.token);
        localStorage.setItem('genzla-user', JSON.stringify(data.user));
        
        if (data.user.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/dashboard');
        }
      } else {
        setError(data.message || 'Failed to create account');
      }
    } catch (error) {
      console.error('Phone submission error:', error);
      setError('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google authentication was cancelled or failed');
  };

  if (showPhoneInput) {
    return (
      <div className={styles.phoneInput}>
        <h3>Complete Your Registration</h3>
        <p>Please provide your phone number to complete your account setup.</p>
        
        <form onSubmit={handlePhoneSubmit} className={styles.phoneForm}>
          <div className={styles.formGroup}>
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              className={styles.phoneInputField}
              placeholder="Enter your phone number"
            />
          </div>
          
          {error && <div className={styles.error}>{error}</div>}
          
          <div className={styles.phoneButtons}>
            <button
              type="button"
              onClick={() => {
                setShowPhoneInput(false);
                setPendingGoogleData(null);
                setPhoneNumber('');
                setError('');
              }}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={styles.submitButton}
            >
              {isLoading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className={styles.googleAuth}>
      {error && <div className={styles.error}>{error}</div>}
      
      <div className={styles.divider}>
        <span>or</span>
      </div>

      <div className={styles.googleButton}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          useOneTap={false}
          text={mode === 'signup' ? 'signup_with' : 'signin_with'}
          theme="outline"
          size="large"
          width="100%"
          disabled={isLoading}
        />
      </div>

      {isLoading && (
        <div className={styles.loading}>
          Authenticating with Google...
        </div>
      )}
    </div>
  );
}
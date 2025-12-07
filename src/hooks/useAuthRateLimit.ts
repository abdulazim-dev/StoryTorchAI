import { useState, useEffect, useCallback } from 'react';

interface RateLimitState {
  attempts: number;
  lockoutUntil: number | null;
  lastAttempt: number;
}

const STORAGE_KEY = 'auth_rate_limit';
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const ATTEMPT_WINDOW_MS = 5 * 60 * 1000; // 5 minute window for counting attempts

export function useAuthRateLimit() {
  const [state, setState] = useState<RateLimitState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignore parsing errors
    }
    return { attempts: 0, lockoutUntil: null, lastAttempt: 0 };
  });

  const [remainingTime, setRemainingTime] = useState<number>(0);

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Update countdown timer
  useEffect(() => {
    if (!state.lockoutUntil) {
      setRemainingTime(0);
      return;
    }

    const updateRemaining = () => {
      const now = Date.now();
      if (state.lockoutUntil && now < state.lockoutUntil) {
        setRemainingTime(Math.ceil((state.lockoutUntil - now) / 1000));
      } else {
        setRemainingTime(0);
        // Clear lockout when time expires
        setState(prev => ({ ...prev, lockoutUntil: null, attempts: 0 }));
      }
    };

    updateRemaining();
    const interval = setInterval(updateRemaining, 1000);
    return () => clearInterval(interval);
  }, [state.lockoutUntil]);

  const isLocked = useCallback(() => {
    if (!state.lockoutUntil) return false;
    return Date.now() < state.lockoutUntil;
  }, [state.lockoutUntil]);

  const recordFailedAttempt = useCallback(() => {
    const now = Date.now();
    
    setState(prev => {
      // Reset attempts if outside the window
      const effectiveAttempts = 
        prev.lastAttempt && (now - prev.lastAttempt) > ATTEMPT_WINDOW_MS 
          ? 1 
          : prev.attempts + 1;

      const newState: RateLimitState = {
        attempts: effectiveAttempts,
        lastAttempt: now,
        lockoutUntil: effectiveAttempts >= MAX_ATTEMPTS 
          ? now + LOCKOUT_DURATION_MS 
          : prev.lockoutUntil,
      };

      return newState;
    });
  }, []);

  const recordSuccessfulAttempt = useCallback(() => {
    setState({ attempts: 0, lockoutUntil: null, lastAttempt: 0 });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const getAttemptsRemaining = useCallback(() => {
    return Math.max(0, MAX_ATTEMPTS - state.attempts);
  }, [state.attempts]);

  const formatRemainingTime = useCallback(() => {
    if (remainingTime <= 0) return '';
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [remainingTime]);

  return {
    isLocked,
    recordFailedAttempt,
    recordSuccessfulAttempt,
    getAttemptsRemaining,
    remainingTime,
    formatRemainingTime,
  };
}

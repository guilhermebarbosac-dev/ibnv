import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const SESSION_TIMEOUT = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

export function useSession() {
  const [lastActivity, setLastActivity] = useState(Date.now());
  const navigate = useNavigate();

  useEffect(() => {
    let timeoutId: number;

    function checkSession() {
      const now = Date.now();
      if (now - lastActivity >= SESSION_TIMEOUT) {
        // Session expired
        supabase.auth.signOut();
        navigate('/admin');
      } else {
        timeoutId = window.setTimeout(checkSession, 60000); // Check every minute
      }
    }

    // Start checking
    timeoutId = window.setTimeout(checkSession, 60000);

    // Update last activity on user interaction
    function updateActivity() {
      setLastActivity(Date.now());
    }

    // Listen for user activity
    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('click', updateActivity);
    window.addEventListener('scroll', updateActivity);

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('click', updateActivity);
      window.removeEventListener('scroll', updateActivity);
    };
  }, [lastActivity, navigate]);
}
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Network {
  id: string;
  title: string;
  description: string;
  image_url: string;
}

export function useNetworks() {
  const [networks, setNetworks] = useState<Network[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNetworks = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('networks')
        .select('*')
        .order('title');

      if (error) throw error;
      setNetworks(data || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching networks:', error);
      setError('Failed to load networks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNetworks();
  }, [fetchNetworks]);

  return { networks, loading, error, fetchNetworks };
}
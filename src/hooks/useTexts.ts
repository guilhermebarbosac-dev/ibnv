import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useTexts() {
  const [texts, setTexts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTexts();
  }, []);

  async function fetchTexts() {
    try {
      const { data, error } = await supabase
        .from('text_data')
        .select('key, value');

      if (error) throw error;

      const textsObject = data?.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {} as Record<string, string>);

      setTexts(textsObject || {});
    } catch (error) {
      console.error('Error fetching texts:', error);
    } finally {
      setLoading(false);
    }
  }

  return { texts, loading, refetch: fetchTexts };
}

import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

export function useRealtimeSubscription(
  table: string,
  onUpdate: () => void,
  filter?: {
    event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
    schema?: string;
    filter?: string;
  }
) {
  useEffect(() => {
    let channel: RealtimeChannel;

    async function setupSubscription() {
      channel = supabase
        .channel(`public:${table}`)
        .on(
          'postgres_changes',
          { 
            event: filter?.event || '*', 
            schema: filter?.schema || 'public', 
            table,
            filter: filter?.filter
          },
          () => onUpdate()
        )
        .subscribe();
    }

    setupSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [table, onUpdate, filter]);
}
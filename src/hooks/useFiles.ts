import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface FileItem {
  name: string;
  path: string;
  isFolder: boolean;
  size?: number;
}

export function useFiles(currentPath: string) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = useCallback(async () => {
    try {
      const { data, error } = await supabase.storage
        .from('downloads')
        .list(currentPath, { sortBy: { column: 'name', order: 'asc' } });

      if (error) throw error;

      const organizedFiles = data.map(item => ({
        name: item.name,
        path: `${currentPath}${item.name}`,
        isFolder: !item.metadata,
        size: item.metadata?.size
      }));

      setFiles(organizedFiles);
      setError(null);
    } catch (error) {
      console.error('Error fetching files:', error);
      setError('Failed to load files');
    } finally {
      setLoading(false);
    }
  }, [currentPath]);

  return { files, loading, error, fetchFiles };
}
import { supabase } from './supabase';

export async function uploadImage(
  file: File, 
  folder: string,
  onProgress?: (progress: number) => void
) {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}.${fileExt}`;

    // Show initial progress
    onProgress?.(0);

    // Simulate progress steps before actual upload
    const progressSteps = [0, 25, 50, 75];
    for (const step of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 300));
      onProgress?.(step);
    }

    const { error: uploadError, data } = await supabase.storage
      .from('images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) throw uploadError;

    // Show completion
    await new Promise(resolve => setTimeout(resolve, 300));
    onProgress?.(100);

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!user) throw new Error('Not authenticated');
  return user;
}
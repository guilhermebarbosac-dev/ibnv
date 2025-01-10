export function sanitizeFilePath(path: string): string {
  // Split path into parts
  const parts = path.split('/');
  
  // Sanitize each part
  const sanitizedParts = parts.map(part => {
    // Replace spaces with underscores
    let sanitized = part.replace(/\s+/g, '_');
    
    // Remove accents/diacritics
    sanitized = sanitized.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    // Remove any characters that might cause issues
    sanitized = sanitized.replace(/[^a-zA-Z0-9-_./]/g, '');
    
    return sanitized;
  });
  
  // Rejoin path
  return sanitizedParts.join('/');
}
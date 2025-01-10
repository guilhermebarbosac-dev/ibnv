export function formatTime(time: string): string {
  if (!time) return '';
  
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const min = parseInt(minutes, 10);
  
  if (isNaN(hour) || isNaN(min)) return '';
  
  return min === 0 ? `${hour}h` : `${hour}h${min.toString().padStart(2, '0')}`;
}
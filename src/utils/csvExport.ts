import { ExiconEntry } from '../types/exicon';

export const exportToCSV = (exercises: ExiconEntry[]): void => {
  const headers = ['Name', 'Definition', 'Tags', 'Aliases', 'Video URL'];
  const csvContent = [
    headers.join(','),
    ...exercises.map(exercise => [
      `"${exercise.name.replace(/"/g, '""')}"`,
      `"${exercise.definition.replace(/"/g, '""')}"`,
      `"${exercise.tags.replace(/"/g, '""')}"`,
      `"${(exercise.aliases || '').replace(/"/g, '""')}"`,
      `"${(exercise.video_url || '').replace(/"/g, '""')}"`
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', 'f3-exicon-export.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}; 
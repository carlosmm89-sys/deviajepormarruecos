import { useEffect } from 'react';
import { dbService } from '../services/dbService';

export function usePageViews(type: 'home' | 'destination' | 'tour', id?: string) {
  useEffect(() => {
    // We only track the view once per component mount (page load)
    const trackView = async () => {
      try {
        if (type === 'home') {
          await dbService.incrementHomeViews();
        } else if (type === 'destination' && id) {
          await dbService.incrementDestViews(id);
        } else if (type === 'tour' && id) {
          await dbService.incrementTourViews(id);
        }
      } catch (err) {
        // Silently fail, analytics shouldn't break the user experience
        console.error('Failed to log page view:', err);
      }
    };
    
    // Prevent tracking local development hot reloads excessively
    const timeoutId = setTimeout(trackView, 1000);
    return () => clearTimeout(timeoutId);
  }, [type, id]);
}

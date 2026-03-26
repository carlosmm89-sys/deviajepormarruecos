import { useState, useEffect } from 'react';

export function useWishlist() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('tour_wishlist');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error('Error parsing wishlist', e);
      }
    }
  }, []);

  const toggleFavorite = (tourId: string) => {
    setFavorites(prev => {
      const newFavs = prev.includes(tourId) 
        ? prev.filter(id => id !== tourId) 
        : [...prev, tourId];
      
      localStorage.setItem('tour_wishlist', JSON.stringify(newFavs));
      return newFavs;
    });
  };

  const isFavorite = (tourId: string) => favorites.includes(tourId);

  return { favorites, toggleFavorite, isFavorite };
}

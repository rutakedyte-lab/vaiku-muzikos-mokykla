import React, { useState, useEffect } from 'react';
import { searchArtistsByInstrument } from '../utils/musicbrainz';

const InstrumentArtists = ({ instrumentName }) => {
  const [artists, setArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtists = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const results = await searchArtistsByInstrument(instrumentName, 3);
        setArtists(results);
      } catch (err) {
        console.error('Error loading artists:', err);
        setError('Nepavyko įkelti atlikėjų');
      } finally {
        setIsLoading(false);
      }
    };

    if (instrumentName) {
      fetchArtists();
    }
  }, [instrumentName]);

  if (isLoading) {
    return (
      <div className="text-sm text-gray-500">
        <div className="animate-pulse">Kraunama...</div>
      </div>
    );
  }

  if (error) {
    return null; // Don't show error, just hide the section
  }

  if (artists.length === 0) {
    return null; // Don't show anything if no artists found
  }

  return (
    <div className="mt-2">
      <p className="text-xs text-gray-500 mb-1">Žymūs atlikėjai:</p>
      <div className="flex flex-wrap gap-2">
        {artists.map((artist) => (
          <span
            key={artist.id}
            className="inline-block px-2 py-1 bg-brand-light-blue-2 text-brand-blue-1 rounded text-xs"
          >
            {artist.name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default InstrumentArtists;

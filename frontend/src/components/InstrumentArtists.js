import React, { useState, useEffect } from 'react';
import { searchVideosByInstrument } from '../utils/youtube';

const InstrumentArtists = ({ instrumentName }) => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const results = await searchVideosByInstrument(instrumentName, 3);
        setVideos(results);
      } catch (err) {
        console.error('Error loading videos:', err);
        setError('Nepavyko įkelti video');
      } finally {
        setIsLoading(false);
      }
    };

    if (instrumentName) {
      fetchVideos();
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

  if (videos.length === 0) {
    return null; // Don't show anything if no videos found
  }

  return (
    <div className="mt-2">
      <p className="text-xs text-gray-500 mb-1">Rekomenduojami video:</p>
      <div className="flex flex-wrap gap-2">
        {videos.map((video) => (
          <a
            key={video.id}
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2 py-1 bg-brand-light-blue-2 text-brand-blue-1 rounded text-xs hover:bg-brand-light-blue-1 transition-colors"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span className="truncate max-w-[120px]">{video.channelTitle}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default InstrumentArtists;

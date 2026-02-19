// YouTube Data API v3 utility
// Note: YouTube API requires an API key (free, get it from Google Cloud Console)
// Add your API key to environment variable REACT_APP_YOUTUBE_API_KEY
// Or set it directly here for testing (not recommended for production)

const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY || '';
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

// Map instrument names to YouTube search queries
const INSTRUMENT_QUERIES = {
  'Fortepijonas': 'piano tutorial',
  'Gitara': 'guitar lesson',
  'Smuikas': 'violin tutorial',
  'Fleita': 'flute lesson',
  'Būgnai': 'drums tutorial',
  'Dainavimas': 'vocal lesson',
};

/**
 * Search for YouTube videos by instrument
 * @param {string} instrumentName - Instrument name in Lithuanian
 * @param {number} maxResults - Number of results (default: 3)
 * @returns {Promise<Array>} Array of video objects
 */
export const searchVideosByInstrument = async (instrumentName, maxResults = 3) => {
  try {
    if (!YOUTUBE_API_KEY) {
      console.warn('YouTube API key not found. Add REACT_APP_YOUTUBE_API_KEY to .env file');
      return [];
    }

    const query = INSTRUMENT_QUERIES[instrumentName] || `${instrumentName.toLowerCase()} tutorial`;
    
    // YouTube Data API v3 search endpoint
    const url = `${YOUTUBE_API_BASE}/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      return data.items.map((item) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.default.url,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      }));
    }

    return [];
  } catch (error) {
    console.error('Error fetching videos from YouTube:', error);
    // Return empty array on error - don't break the UI
    return [];
  }
};

/**
 * Get YouTube channel info by channel ID
 * @param {string} channelId - YouTube channel ID
 * @returns {Promise<Object>} Channel details
 */
export const getChannelInfo = async (channelId) => {
  try {
    if (!YOUTUBE_API_KEY) {
      return null;
    }

    const url = `${YOUTUBE_API_BASE}/channels?part=snippet&id=${channelId}&key=${YOUTUBE_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      return data.items[0];
    }

    return null;
  } catch (error) {
    console.error('Error fetching channel info:', error);
    return null;
  }
};

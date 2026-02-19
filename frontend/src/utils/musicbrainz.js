// MusicBrainz API utility
// Note: MusicBrainz API doesn't support CORS, so we use a CORS proxy
// Using allorigins.win as a free CORS proxy (for development)
// In production, consider using Vercel serverless function as proxy

const CORS_PROXY = 'https://api.allorigins.win/raw?url=';
const MUSICBRAINZ_API_BASE = 'https://musicbrainz.org/ws/2';

// Map instrument names to MusicBrainz tags
const INSTRUMENT_TAGS = {
  'Fortepijonas': 'piano',
  'Gitara': 'guitar',
  'Smuikas': 'violin',
  'Fleita': 'flute',
  'Būgnai': 'drums',
  'Dainavimas': 'vocal',
};

/**
 * Search for artists by instrument tag
 * @param {string} instrumentName - Instrument name in Lithuanian
 * @param {number} limit - Number of results (default: 5)
 * @returns {Promise<Array>} Array of artist objects
 */
export const searchArtistsByInstrument = async (instrumentName, limit = 5) => {
  try {
    const tag = INSTRUMENT_TAGS[instrumentName] || instrumentName.toLowerCase();
    
    // MusicBrainz API endpoint for searching artists by tag
    const url = `${MUSICBRAINZ_API_BASE}/artist/?query=tag:${tag}&limit=${limit}&fmt=json`;
    const proxyUrl = `${CORS_PROXY}${encodeURIComponent(url)}`;

    const response = await fetch(proxyUrl, {
      headers: {
        'User-Agent': 'VaikuMuzikosMokykla/1.0.0 (https://vaiku-muzikos-mokykla.vercel.app)',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`MusicBrainz API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.artists && data.artists.length > 0) {
      return data.artists.map((artist) => ({
        id: artist.id,
        name: artist.name,
        type: artist.type || 'Person',
        country: artist.country || 'Unknown',
        disambiguation: artist.disambiguation || '',
      }));
    }

    return [];
  } catch (error) {
    console.error('Error fetching artists from MusicBrainz:', error);
    // Return empty array on error - don't break the UI
    return [];
  }
};

/**
 * Get artist details by MusicBrainz ID
 * @param {string} artistId - MusicBrainz artist ID
 * @returns {Promise<Object>} Artist details
 */
export const getArtistDetails = async (artistId) => {
  try {
    const url = `${MUSICBRAINZ_API_BASE}/artist/${artistId}?fmt=json&inc=releases`;
    const proxyUrl = `${CORS_PROXY}${encodeURIComponent(url)}`;

    const response = await fetch(proxyUrl, {
      headers: {
        'User-Agent': 'VaikuMuzikosMokykla/1.0.0 (https://vaiku-muzikos-mokykla.vercel.app)',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`MusicBrainz API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching artist details:', error);
    return null;
  }
};

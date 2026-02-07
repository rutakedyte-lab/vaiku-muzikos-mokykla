import { GiPianoKeys, GiGuitar, GiViolin, GiFlute, GiDrumKit } from 'react-icons/gi';

const baseUrl = process.env.PUBLIC_URL || '';

export const instrumentSounds = [
  { id: 'piano', name: 'Fortepijonas', soundFile: `${baseUrl}/sounds/instruments/piano.mp3`, Icon: GiPianoKeys },
  { id: 'guitar', name: 'Gitara', soundFile: `${baseUrl}/sounds/instruments/guitar.mp3`, Icon: GiGuitar },
  { id: 'violin', name: 'Smuikas', soundFile: `${baseUrl}/sounds/instruments/violin.mp3`, Icon: GiViolin },
  { id: 'flute', name: 'Fleita', soundFile: `${baseUrl}/sounds/instruments/flute.mp3`, Icon: GiFlute },
  { id: 'drums', name: 'Būgnai', soundFile: `${baseUrl}/sounds/instruments/drums.mp3`, Icon: GiDrumKit },
];

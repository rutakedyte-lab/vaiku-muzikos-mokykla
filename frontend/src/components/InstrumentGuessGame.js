import React, { useState, useCallback, useRef } from 'react';
import { instrumentSounds } from '../data/instrumentSounds';

const NUM_CHOICES = 4;

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getRandomChoices(correctInstrument) {
  const others = instrumentSounds.filter((inst) => inst.id !== correctInstrument.id);
  const shuffled = shuffle(others);
  const choices = [correctInstrument, ...shuffled.slice(0, NUM_CHOICES - 1)];
  return shuffle(choices);
}

const InstrumentGuessGame = () => {
  const [currentInstrument, setCurrentInstrument] = useState(null);
  const [choices, setChoices] = useState([]);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [soundError, setSoundError] = useState(false);
  const audioRef = useRef(null);

  const startRound = useCallback(() => {
    setSoundError(false);
    setAnswered(false);
    const correct = instrumentSounds[Math.floor(Math.random() * instrumentSounds.length)];
    setCurrentInstrument(correct);
    setChoices(getRandomChoices(correct));
  }, []);

  const playSound = useCallback(() => {
    if (!currentInstrument) return;
    setSoundError(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    const audio = new Audio(currentInstrument.soundFile);
    audioRef.current = audio;
    audio.play().catch(() => setSoundError(true));
  }, [currentInstrument]);

  const handleChoice = (instrument) => {
    if (answered) return;
    setAnswered(true);
    setIsCorrect(instrument.id === currentInstrument.id);
  };

  const hasStarted = currentInstrument !== null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-merriweather italic text-brand-blue-1 mb-4">
        Atspėk, kokio instrumento garsas skamba
      </h3>

      {!hasStarted ? (
        <button
          type="button"
          onClick={startRound}
          className="px-6 py-3 bg-brand-blue-1 text-white rounded-md hover:bg-brand-blue-2 transition-colors font-medium"
        >
          Pradėti žaidimą
        </button>
      ) : (
        <>
          <div className="flex flex-wrap gap-4 mb-4">
            <button
              type="button"
              onClick={playSound}
              className="px-4 py-2 bg-brand-light-blue-2 text-brand-blue-1 rounded-md hover:bg-brand-light-blue-1 transition-colors font-medium"
            >
              Groti garsą
            </button>
            {soundError && (
              <span className="text-sm text-amber-600 py-2">
                Garsas neprieinamas. Pridėkite MP3 į public/sounds/instruments/
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {choices.map((inst) => {
              const Icon = inst.Icon;
              const correct = answered && inst.id === currentInstrument.id;
              const wrong = answered && inst.id !== currentInstrument.id && isCorrect === false;
              const disabled = answered;
              return (
                <button
                  key={inst.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleChoice(inst)}
                  className={`
                    flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all
                    ${disabled ? 'cursor-default' : 'hover:bg-brand-light-blue-2 cursor-pointer'}
                    ${correct ? 'border-green-500 bg-green-50' : ''}
                    ${wrong ? 'border-red-300 bg-red-50 opacity-70' : ''}
                    ${!answered ? 'border-brand-blue-1' : ''}
                  `}
                >
                  <Icon className="w-12 h-12 text-brand-blue-1 mb-2" aria-hidden />
                  <span className="text-sm font-medium text-gray-800 text-center">{inst.name}</span>
                </button>
              );
            })}
          </div>

          {answered && (
            <div className="flex flex-wrap items-center gap-4">
              <p className={isCorrect ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                {isCorrect ? 'Teisingai!' : 'Neteisingai. Teisingas atsakymas: ' + currentInstrument.name}
              </p>
              <button
                type="button"
                onClick={startRound}
                className="px-4 py-2 bg-brand-blue-1 text-white rounded-md hover:bg-brand-blue-2 transition-colors font-medium"
              >
                Kitas
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default InstrumentGuessGame;

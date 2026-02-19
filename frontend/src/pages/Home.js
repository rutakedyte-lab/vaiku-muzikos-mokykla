import React from 'react';
import { Link } from 'react-router-dom';
import { useTeachers } from '../hooks/useTeachers';
import { programs } from '../data/programs';
import InstrumentGuessGame from '../components/InstrumentGuessGame';
import InstrumentArtists from '../components/InstrumentArtists';

const Home = () => {
  const { teachers, isLoading: teachersLoading } = useTeachers();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Minimal header – tik logotipas ir Prisijungti */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-brand-blue-1 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <div>
                <h1 className="text-lg font-merriweather italic text-brand-blue-1">
                  Vilniaus Broniaus Jonušo
                </h1>
                <p className="text-sm font-neutral text-gray-600">Muzikos Mokykla</p>
              </div>
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 bg-brand-blue-1 text-white rounded-md hover:bg-brand-blue-2 transition-colors font-medium"
            >
              Prisijungti
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* 1. Mokykla */}
        <section>
          <h2 className="text-3xl font-merriweather italic text-brand-blue-1 mb-4">
            Apie mokyklą
          </h2>
          <p className="text-gray-700 max-w-3xl leading-relaxed">
            Vilniaus Broniaus Jonušo Muzikos Mokykla – vieta, kur vaikai ir suaugusieji mokosi
            groti įvairiais instrumentais ir dainuoti. Siūlome individualius ir grupinius
            užsiėmimus, rengiame koncertus ir šventes. Sveiki visi, norintys pradėti ar
            tobulinti savo muzikinius gebėjimus.
          </p>
        </section>

        {/* 2. Mokytojai */}
        <section>
          <h2 className="text-3xl font-merriweather italic text-brand-blue-1 mb-4">
            Mokytojai
          </h2>
          {teachersLoading ? (
            <div className="flex items-center gap-3 text-gray-600">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-blue-1 border-t-transparent" />
              <span>Kraunama...</span>
            </div>
          ) : teachers.length === 0 ? (
            <p className="text-gray-600">Kol kas nėra pridėtų mokytojų.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {teachers.map((t) => (
                <div
                  key={t.id}
                  className="bg-white rounded-lg shadow-md p-4 border border-gray-100"
                >
                  <p className="font-medium text-gray-900">{t.vardas}</p>
                  <p className="text-sm text-gray-600">{t.specialybė}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 3. Mokymo programos */}
        <section>
          <h2 className="text-3xl font-merriweather italic text-brand-blue-1 mb-4">
            Mokymo programos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {programs.map((prog) => (
              <div
                key={prog.id}
                className="bg-white rounded-lg shadow-md p-4 border border-gray-100"
              >
                <h3 className="font-medium text-brand-blue-1 mb-1">{prog.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{prog.description}</p>
                <InstrumentArtists instrumentName={prog.name} />
              </div>
            ))}
          </div>
        </section>

        {/* 4. Mini žaidimas */}
        <section>
          <InstrumentGuessGame />
        </section>

        {/* 5. CTA – Pamokos */}
        <section className="text-center py-8">
          <p className="text-gray-700 mb-4">
            Norite peržiūrėti pamokų tvarkaraštį ir medžiagą?
          </p>
          <Link
            to="/lessons"
            className="inline-block px-8 py-3 bg-brand-blue-1 text-white rounded-md hover:bg-brand-blue-2 transition-colors font-medium"
          >
            Peržiūrėti pamokas
          </Link>
        </section>
      </main>
    </div>
  );
};

export default Home;

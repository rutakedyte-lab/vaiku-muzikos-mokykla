import React, { useState, useEffect } from 'react';

const StudentForm = ({ student, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    vardas: '',
    amžius: '',
    instrumentas: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (student) {
      setFormData({
        vardas: student.vardas || '',
        amžius: student.amžius || '',
        instrumentas: student.instrumentas || '',
      });
    }
  }, [student]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.vardas || !formData.amžius || !formData.instrumentas) {
      setError('Visi laukai privalomi');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      setError(error.message || 'Klaida išsaugant duomenis');
    }
  };

  const commonInstruments = [
    'Fortepijonas',
    'Gitara',
    'Smulkė',
    'Fleita',
    'Klarinetas',
    'Saksofonas',
    'Trombonas',
    'Trimitas',
    'Būgnai',
    'Kanklės',
    'Kita',
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-merriweather italic text-brand-blue-1 mb-4">
          {student ? 'Redaguoti mokinį' : 'Pridėti mokinį'}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="vardas" className="block text-sm font-medium text-gray-700 mb-1">
              Vardas *
            </label>
            <input
              type="text"
              id="vardas"
              name="vardas"
              value={formData.vardas}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue-1"
              required
            />
          </div>

          <div>
            <label htmlFor="amžius" className="block text-sm font-medium text-gray-700 mb-1">
              Amžius *
            </label>
            <input
              type="number"
              id="amžius"
              name="amžius"
              value={formData.amžius}
              onChange={handleChange}
              min="1"
              max="18"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue-1"
              required
            />
          </div>

          <div>
            <label htmlFor="instrumentas" className="block text-sm font-medium text-gray-700 mb-1">
              Instrumentas *
            </label>
            <select
              id="instrumentas"
              name="instrumentas"
              value={formData.instrumentas}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue-1"
              required
            >
              <option value="">Pasirinkite instrumentą</option>
              {commonInstruments.map((instrument) => (
                <option key={instrument} value={instrument}>
                  {instrument}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Atšaukti
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brand-blue-1 text-white rounded-md hover:bg-brand-blue-2 transition-colors"
            >
              {student ? 'Išsaugoti' : 'Pridėti'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;

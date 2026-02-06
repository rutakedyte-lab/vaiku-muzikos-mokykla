import React, { useState, useEffect } from 'react';
import { useLessons } from '../hooks/useLessons';
import { useAuth } from '../context/AuthContext';
import { saveVideo, getVideo, deleteVideo } from '../utils/videoStorage';

const LessonVideo = ({ lesson, onClose }) => {
  const [videoUrl, setVideoUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const { isAdmin } = useAuth();
  const { updateLessonVideo } = useLessons();

  useEffect(() => {
    loadVideo();
  }, [lesson]);

  const loadVideo = async () => {
    if (lesson.video_path && lesson.video_path.startsWith('local://')) {
      const videoId = lesson.video_path.replace('local://', '');
      const videoData = await getVideo(videoId);
      if (videoData) {
        setVideoUrl(videoData);
      }
    } else if (lesson.video_path) {
      setVideoUrl(lesson.video_path);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (100MB limit)
      if (file.size > 100 * 1024 * 1024) {
        alert('Video failas per didelis. Maksimalus dydis: 100MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      const videoPath = await saveVideo(lesson.id, selectedFile);
      await updateLessonVideo(lesson.id, videoPath);
      await loadVideo();
      setSelectedFile(null);
      alert('Video sėkmingai įkeltas!');
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Klaida įkeliant video: ' + (error.message || 'Nežinoma klaida'));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Ar tikrai norite ištrinti šį video?')) return;

    try {
      if (lesson.video_path && lesson.video_path.startsWith('local://')) {
        const videoId = lesson.video_path.replace('local://', '');
        await deleteVideo(videoId);
      }
      await updateLessonVideo(lesson.id, null);
      setVideoUrl(null);
      alert('Video sėkmingai ištrintas!');
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('Klaida ištrinant video');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-merriweather italic text-brand-blue-1">
            Pamokos video
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            <strong>Mokinys:</strong> {lesson.student?.vardas} |{' '}
            <strong>Mokytojas:</strong> {lesson.teacher?.vardas} |{' '}
            <strong>Laikas:</strong> {lesson.laikas}
          </p>
        </div>

        {videoUrl ? (
          <div className="space-y-4">
            <div className="bg-black rounded-lg overflow-hidden">
              <video
                controls
                className="w-full"
                src={videoUrl}
              >
                Jūsų naršyklė nepalaiko video elemento.
              </video>
            </div>
            {isAdmin() && (
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Ištrinti video
              </button>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-6 text-lg">Video dar nėra įkeltas</p>
            {isAdmin() ? (
              <div className="space-y-4 max-w-md mx-auto">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <label className="cursor-pointer">
                    <div className="text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-600">
                        <span className="font-medium text-brand-blue-1">Spustelėkite, kad pasirinktumėte video</span>
                        <br />
                        arba vilkite failą čia
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        MP4, WebM, OGG (maks. 100MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                </div>
                {selectedFile && (
                  <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedFile(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ×
                      </button>
                    </div>
                    <button
                      onClick={handleUpload}
                      disabled={uploading}
                      className="w-full px-6 py-3 bg-brand-blue-1 text-white rounded-md hover:bg-brand-blue-2 transition-colors disabled:opacity-50 font-medium"
                    >
                      {uploading ? 'Įkeliama...' : 'Įkelti video'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500">Video dar nėra įkeltas šiai pamokai</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonVideo;

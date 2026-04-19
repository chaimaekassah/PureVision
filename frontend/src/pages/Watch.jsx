import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';

const Watch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await api.get(`/movies/${id}`);
        const m = res.data?.movie;
        if (!cancelled) {
          if (!m?.video_url) {
            setError('Aucune vidéo disponible pour ce titre.');
            setMovie(m || null);
          } else {
            setMovie(m);
          }
        }
      } catch (e) {
        if (!cancelled) {
          setError(e.response?.data?.message || 'Impossible de charger le film.');
        }
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div className="watch-page">
      <header className="watch-header">
        <button
          type="button"
          className="watch-back"
          onClick={() => navigate('/browse')}
        >
          ← Retour au catalogue
        </button>
      </header>

      {error && !movie?.video_url && (
        <div className="watch-error global-error">
          <span>⚠</span> {error}
        </div>
      )}

      {!movie && !error && <p className="watch-loading">Chargement…</p>}

      {movie?.video_url && (
        <div className="watch-main">
          <video
            className="watch-video"
            controls
            playsInline
            autoPlay
            src={movie.video_url}
          >
            Votre navigateur ne prend pas en charge la lecture HTML5.
          </video>
          <div className="watch-meta">
            <h1 className="watch-title">{movie.title}</h1>
            <p className="watch-sub">{movie.genre}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Watch;

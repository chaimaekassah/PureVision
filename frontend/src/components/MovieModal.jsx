import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MovieModal = ({ movie, onClose }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!movie) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [movie, onClose]);

  if (!movie) return null;

  const bg = movie.backdrop_url || movie.poster_url;
  const year = movie.release_year ? movie.release_year : '—';
  const rating = movie.rating != null ? `${movie.rating}/10` : '—';
  const duration =
    movie.duration_minutes != null ? `${movie.duration_minutes} min` : '—';

  return (
    <div className="movie-modal-root" role="dialog" aria-modal="true" aria-labelledby="movie-modal-title">
      <button type="button" className="movie-modal-backdrop" onClick={onClose} aria-label="Fermer" />
      <div className="movie-modal-panel">
        <button type="button" className="movie-modal-close" onClick={onClose} aria-label="Fermer">
          ×
        </button>
        <div
          className="movie-modal-banner"
          style={{ backgroundImage: `linear-gradient(to top, rgba(10,10,20,0.98), rgba(10,10,20,0.4)), url(${bg})` }}
        />
        <div className="movie-modal-body">
          <h2 id="movie-modal-title">{movie.title}</h2>
          <p className="movie-modal-meta">
            {movie.genre} · {year} · {rating} · {duration}
          </p>
          <p className="movie-modal-synopsis">{movie.synopsis}</p>
          <button
            type="button"
            className="btn-hero-play movie-modal-play"
            disabled={!movie.video_url}
            onClick={() => {
              if (movie.video_url) {
                navigate(`/watch/${movie.id}`);
                onClose();
              }
            }}
          >
            {movie.video_url ? '▶ Lecture' : 'Lecture indisponible'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;

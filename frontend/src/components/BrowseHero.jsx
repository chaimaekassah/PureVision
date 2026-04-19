import React from 'react';

const BrowseHero = ({ movie, onPlay, onInfo }) => {
  if (!movie) return null;

  const bg = movie.backdrop_url || movie.poster_url;
  const year = movie.release_year ? ` · ${movie.release_year}` : '';
  const rating = movie.rating != null ? `${movie.rating}/10` : '';
  const duration =
    movie.duration_minutes != null ? `${movie.duration_minutes} min` : '';

  return (
    <section className="browse-hero">
      <div
        className="browse-hero-bg"
        style={{ backgroundImage: `url(${bg})` }}
        aria-hidden
      />
      <div className="browse-hero-gradient" />
      <div className="browse-hero-content">
        <p className="browse-hero-badge">Nouveauté</p>
        <h1 className="browse-hero-title">{movie.title}</h1>
        <p className="browse-hero-meta">
          {[rating, year, duration].filter(Boolean).join(' · ')}
        </p>
        <p className="browse-hero-synopsis">{movie.synopsis}</p>
        <div className="browse-hero-actions">
          <button type="button" className="btn-hero-play" onClick={() => onPlay?.(movie)}>
            ▶ Lecture
          </button>
          <button
            type="button"
            className="btn-hero-info"
            onClick={() => (onInfo ?? onPlay)?.(movie)}
          >
            ℹ Plus d&apos;infos
          </button>
        </div>
      </div>
    </section>
  );
};

export default BrowseHero;

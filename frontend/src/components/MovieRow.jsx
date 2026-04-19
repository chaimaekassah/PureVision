import React, { useRef } from 'react';
import MovieCard from './MovieCard';

const MovieRow = ({ title, movies, onSelectMovie }) => {
  const rowRef = useRef(null);

  const scroll = (dir) => {
    const el = rowRef.current;
    if (!el) return;
    const delta = dir === 'left' ? -720 : 720;
    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  if (!movies?.length) return null;

  return (
    <section className="movie-row">
      <div className="movie-row-header">
        <h2 className="movie-row-title">{title}</h2>
        <div className="movie-row-controls">
          <button
            type="button"
            className="movie-row-chevron"
            onClick={() => scroll('left')}
            aria-label="Faire défiler vers la gauche"
          >
            ‹
          </button>
          <button
            type="button"
            className="movie-row-chevron"
            onClick={() => scroll('right')}
            aria-label="Faire défiler vers la droite"
          >
            ›
          </button>
        </div>
      </div>
      <div className="movie-row-scroll" ref={rowRef}>
        {movies.map((m) => (
          <MovieCard key={m.id} movie={m} onSelect={onSelectMovie} />
        ))}
      </div>
    </section>
  );
};

export default MovieRow;

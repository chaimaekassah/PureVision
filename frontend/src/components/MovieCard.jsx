import React from 'react';

const MovieCard = ({ movie, onSelect }) => {
  return (
    <button
      type="button"
      className={`movie-card${movie.video_url ? ' movie-card--has-video' : ''}`}
      onClick={() => onSelect(movie)}
      aria-label={`${movie.title}, ${movie.genre}`}
    >
      <div className="movie-card-inner">
        <img
          src={movie.poster_url}
          alt=""
          className="movie-card-poster"
          loading="lazy"
        />
        <div className="movie-card-overlay">
          <span className="movie-card-title">{movie.title}</span>
          {movie.rating != null && (
            <span className="movie-card-rating">{movie.rating} ★</span>
          )}
        </div>
      </div>
    </button>
  );
};

export default MovieCard;

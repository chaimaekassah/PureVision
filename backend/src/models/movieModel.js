import db from '../config/db.js';

export const findAll = async () => {
  const { rows } = await db.query(
    `SELECT id, title, synopsis, poster_url, backdrop_url, video_url, release_year, genre, rating, duration_minutes, is_featured, created_at
     FROM movies
     ORDER BY genre ASC, title ASC`
  );
  return rows;
};

export const findByGenre = async (genre) => {
  const { rows } = await db.query(
    `SELECT id, title, synopsis, poster_url, backdrop_url, video_url, release_year, genre, rating, duration_minutes, is_featured, created_at
     FROM movies
     WHERE genre = $1
     ORDER BY title ASC`,
    [genre]
  );
  return rows;
};

export const findById = async (id) => {
  const { rows } = await db.query(
    `SELECT id, title, synopsis, poster_url, backdrop_url, video_url, release_year, genre, rating, duration_minutes, is_featured, created_at
     FROM movies
     WHERE id = $1`,
    [id]
  );
  return rows[0] ?? null;
};

export const findFeatured = async () => {
  const { rows } = await db.query(
    `SELECT id, title, synopsis, poster_url, backdrop_url, video_url, release_year, genre, rating, duration_minutes, is_featured, created_at
     FROM movies
     WHERE is_featured = true
     LIMIT 1`
  );
  if (rows[0]) return rows[0];
  const fallback = await db.query(
    `SELECT id, title, synopsis, poster_url, backdrop_url, video_url, release_year, genre, rating, duration_minutes, is_featured, created_at
     FROM movies
     ORDER BY rating DESC NULLS LAST
     LIMIT 1`
  );
  return fallback.rows[0] ?? null;
};

export const listGenres = async () => {
  const { rows } = await db.query(
    `SELECT DISTINCT genre FROM movies ORDER BY genre ASC`
  );
  return rows.map((r) => r.genre);
};

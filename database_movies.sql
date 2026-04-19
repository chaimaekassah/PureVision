-- Catalogue de films (à exécuter après database.sql)
-- 12 films : jaquettes MinIO movies-bucket/posters et .../backdrops (video_url toujours NULL).
CREATE TABLE IF NOT EXISTS movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    synopsis TEXT,
    poster_url TEXT NOT NULL,
    backdrop_url TEXT,
    video_url TEXT,
    release_year INT,
    genre VARCHAR(80) NOT NULL,
    rating DECIMAL(2,1),
    duration_minutes INT,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_movies_genre ON movies(genre);
CREATE INDEX IF NOT EXISTS idx_movies_featured ON movies(is_featured);

ALTER TABLE movies ADD COLUMN IF NOT EXISTS video_url TEXT;

DELETE FROM movies;

INSERT INTO movies (title, synopsis, poster_url, backdrop_url, release_year, genre, rating, duration_minutes, is_featured, video_url)
VALUES
(
  'Inception',
  'Un voleur expérimenté entre dans les rêves pour implanter une idée dans l''esprit d''un héritier.',
  'http://localhost:9000/movies-bucket/posters/inception.jpg',
  'http://localhost:9000/movies-bucket/backdrops/inception.jpg',
  2010,
  'Science-fiction',
  8.8,
  148,
  true,
  NULL
),
(
  'Interstellar',
  'Des explorateurs voyagent à travers un trou de ver au-delà de la Voie lactée pour sauver l''humanité.',
  'http://localhost:9000/movies-bucket/posters/interstellar.jpg',
  'http://localhost:9000/movies-bucket/backdrops/interstellar.jpg',
  2014,
  'Science-fiction',
  8.6,
  169,
  false,
  NULL
),
(
  'The Dark Knight',
  'Batman affronte le Joker, un criminel anarchiste qui plonge Gotham dans le chaos.',
  'http://localhost:9000/movies-bucket/posters/darkknight.jpg',
  'http://localhost:9000/movies-bucket/backdrops/darkknight.jpg',
  2008,
  'Action',
  9.0,
  152,
  false,
  NULL
),
(
  'John Wick',
  'Un ancien tueur à gages sort de sa retraite pour se venger de ceux qui lui ont tout pris.',
  'http://localhost:9000/movies-bucket/posters/johnwick.jpg',
  'http://localhost:9000/movies-bucket/backdrops/johnwick.jpg',
  2014,
  'Action',
  7.4,
  101,
  false,
  NULL
),
(
  'Intouchables',
  'L''amitié improbable entre un aristocrate tétraplégique et son aide à domicile.',
  'http://localhost:9000/movies-bucket/posters/intouchables.jpg',
  'http://localhost:9000/movies-bucket/backdrops/intouchables.jpg',
  2011,
  'Comédie',
  8.5,
  112,
  false,
  NULL
),
(
  'Le Grand Bain',
  'Un groupe d''hommes d''âge mûr forme une équipe de natation synchronisée.',
  'http://localhost:9000/movies-bucket/posters/grandbain.jpg',
  'http://localhost:9000/movies-bucket/backdrops/grandbain.jpg',
  2018,
  'Comédie',
  7.0,
  122,
  false,
  NULL
),
(
  'La La Land',
  'À Los Angeles, une actrice en devenir et un musicien de jazz tombent amoureux.',
  'http://localhost:9000/movies-bucket/posters/lalaland.jpg',
  'http://localhost:9000/movies-bucket/backdrops/lalaland.jpg',
  2016,
  'Drame',
  8.0,
  128,
  false,
  NULL
),
(
  'Parasite',
  'Une famille pauvre s''infiltre chez les richissimes Park, avec des conséquences imprévisibles.',
  'http://localhost:9000/movies-bucket/posters/parasite.jpg',
  'http://localhost:9000/movies-bucket/backdrops/parasite.jpg',
  2019,
  'Thriller',
  8.5,
  132,
  false,
  NULL
),
(
  'Seven',
  'Deux inspecteurs traquent un serial killer qui s''inspire des sept péchés capitaux.',
  'http://localhost:9000/movies-bucket/posters/seven.jpg',
  'http://localhost:9000/movies-bucket/backdrops/seven.jpg',
  1995,
  'Thriller',
  8.6,
  127,
  false,
  NULL
),
(
  'Dune',
  'Paul Atreides se rend sur la planète désertique Arrakis, seule source d''une épice convoitée.',
  'http://localhost:9000/movies-bucket/posters/dune.jpg',
  'http://localhost:9000/movies-bucket/backdrops/dune.jpg',
  2021,
  'Science-fiction',
  8.0,
  155,
  false,
  NULL
),
(
  'Mad Max: Fury Road',
  'Dans un désert post-apocalyptique, Max aide Furiosa à fuir un tyran.',
  'http://localhost:9000/movies-bucket/posters/madmax.jpg',
  'http://localhost:9000/movies-bucket/backdrops/madmax.jpg',
  2015,
  'Action',
  8.1,
  120,
  false,
  NULL
),
(
  'Amélie Poulain',
  'Une jeune serveuse parisienne décide d''améliorer la vie de ceux qui l''entourent.',
  'http://localhost:9000/movies-bucket/posters/amelie.jpg',
  'http://localhost:9000/movies-bucket/backdrops/amelie.jpg',
  2001,
  'Comédie',
  8.3,
  122,
  false,
  NULL
);

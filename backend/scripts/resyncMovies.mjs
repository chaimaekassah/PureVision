/**
 * [OPTIONNEL — nécessite TMDB] Ne pas utiliser si ton catalogue est uniquement MinIO + `database_movies.sql`.
 *
 * Réinsère **uniquement les 12 films TMDB** (affiches → `movies-bucket`). Efface toute la table
 * `movies` : équivalent au catalogue de `database_movies.sql` (sans TMDB, réimporte ce fichier à la place).
 *
 * Réinsère le catalogue (UTF-8). Récupère affiches & fonds sur **The Movie Database (TMDB)**,
 * puis les enregistre dans **MinIO** ; les URLs en PostgreSQL pointent vers MinIO.
 *
 * Prérequis dans backend/.env :
 *   TMDB_API_KEY=...   (clé gratuite : https://www.themoviedb.org/settings/api )
 *
 * MinIO :
 *   MINIO_PUBLIC_URL=http://localhost:9000
 *   MINIO_SKIP=1  → pas d’upload MinIO, URLs TMDB directes en base (toujours vraies jaquettes)
 */
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import pkg from 'pg';
import * as Minio from 'minio';

const { Pool } = pkg;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'netflix_clone',
  password: process.env.DB_PASSWORD || 'password',
  port: Number(process.env.DB_PORT) || 5432,
  options: '-c client_encoding=UTF8',
});

const skipMinio =
  process.env.MINIO_SKIP === '1' || process.env.MINIO_SKIP === 'true';

const minioConfig = {
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: Number(process.env.MINIO_PORT) || 9000,
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'admin',
  secretKey: process.env.MINIO_SECRET_KEY || 'admin123',
};

const BUCKET = process.env.MINIO_BUCKET || 'movies-bucket';
const PUBLIC_BASE = (process.env.MINIO_PUBLIC_URL || 'http://localhost:9000').replace(
  /\/$/,
  ''
);

const TMDB_IMG = 'https://image.tmdb.org/t/p';
const TMDB_API = 'https://api.themoviedb.org/3/movie';

/** id TMDB → métadonnées catalogue (textes inchangés) */
const movies = [
  {
    slug: 'inception',
    tmdbId: 27205,
    title: 'Inception',
    synopsis:
      "Un voleur expérimenté entre dans les rêves pour implanter une idée dans l'esprit d'un héritier.",
    release_year: 2010,
    genre: 'Science-fiction',
    rating: 8.8,
    duration_minutes: 148,
    is_featured: true,
  },
  {
    slug: 'interstellar',
    tmdbId: 157336,
    title: 'Interstellar',
    synopsis:
      "Des explorateurs voyagent à travers un trou de ver au-delà de la Voie lactée pour sauver l'humanité.",
    release_year: 2014,
    genre: 'Science-fiction',
    rating: 8.6,
    duration_minutes: 169,
    is_featured: false,
  },
  {
    slug: 'darkknight',
    tmdbId: 155,
    title: 'The Dark Knight',
    synopsis:
      'Batman affronte le Joker, un criminel anarchiste qui plonge Gotham dans le chaos.',
    release_year: 2008,
    genre: 'Action',
    rating: 9.0,
    duration_minutes: 152,
    is_featured: false,
  },
  {
    slug: 'johnwick',
    tmdbId: 245891,
    title: 'John Wick',
    synopsis:
      'Un ancien tueur à gages sort de sa retraite pour se venger de ceux qui lui ont tout pris.',
    release_year: 2014,
    genre: 'Action',
    rating: 7.4,
    duration_minutes: 101,
    is_featured: false,
  },
  {
    slug: 'intouchables',
    tmdbId: 77338,
    title: 'Intouchables',
    synopsis:
      "L'amitié improbable entre un aristocrate tétraplégique et son aide à domicile.",
    release_year: 2011,
    genre: 'Comédie',
    rating: 8.5,
    duration_minutes: 112,
    is_featured: false,
  },
  {
    slug: 'grandbain',
    tmdbId: 504198,
    title: 'Le Grand Bain',
    synopsis:
      "Un groupe d'hommes d'âge mûr forme une équipe de natation synchronisée.",
    release_year: 2018,
    genre: 'Comédie',
    rating: 7.0,
    duration_minutes: 122,
    is_featured: false,
  },
  {
    slug: 'lalaland',
    tmdbId: 313369,
    title: 'La La Land',
    synopsis:
      'À Los Angeles, une actrice en devenir et un musicien de jazz tombent amoureux.',
    release_year: 2016,
    genre: 'Drame',
    rating: 8.0,
    duration_minutes: 128,
    is_featured: false,
  },
  {
    slug: 'parasite',
    tmdbId: 496243,
    title: 'Parasite',
    synopsis:
      "Une famille pauvre s'infiltre chez les richissimes Park, avec des conséquences imprévisibles.",
    release_year: 2019,
    genre: 'Thriller',
    rating: 8.5,
    duration_minutes: 132,
    is_featured: false,
  },
  {
    slug: 'seven',
    tmdbId: 807,
    title: 'Seven',
    synopsis:
      "Deux inspecteurs traquent un serial killer qui s'inspire des sept péchés capitaux.",
    release_year: 1995,
    genre: 'Thriller',
    rating: 8.6,
    duration_minutes: 127,
    is_featured: false,
  },
  {
    slug: 'dune',
    tmdbId: 438631,
    title: 'Dune',
    synopsis:
      "Paul Atreides se rend sur la planète désertique Arrakis, seule source d'une épice convoitée.",
    release_year: 2021,
    genre: 'Science-fiction',
    rating: 8.0,
    duration_minutes: 155,
    is_featured: false,
  },
  {
    slug: 'madmax',
    tmdbId: 76341,
    title: 'Mad Max: Fury Road',
    synopsis:
      'Dans un désert post-apocalyptique, Max aide Furiosa à fuir un tyran.',
    release_year: 2015,
    genre: 'Action',
    rating: 8.1,
    duration_minutes: 120,
    is_featured: false,
  },
  {
    slug: 'amelie',
    tmdbId: 194,
    title: 'Amélie Poulain',
    synopsis:
      "Une jeune serveuse parisienne décide d'améliorer la vie de ceux qui l'entourent.",
    release_year: 2001,
    genre: 'Comédie',
    rating: 8.3,
    duration_minutes: 122,
    is_featured: false,
  },
];

const insertSql = `
  INSERT INTO movies (
    title, synopsis, poster_url, backdrop_url, release_year, genre, rating, duration_minutes, is_featured, video_url
  ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
`;

async function fetchTmdbSources(tmdbId) {
  const key = process.env.TMDB_API_KEY?.trim();
  if (!key) {
    throw new Error(
      'TMDB_API_KEY manquant dans backend/.env (clé gratuite : https://www.themoviedb.org/settings/api )'
    );
  }
  const url = `${TMDB_API}/${tmdbId}?api_key=${encodeURIComponent(key)}`;
  const res = await fetch(url);
  const j = await res.json();
  if (!res.ok || j.success === false) {
    throw new Error(
      `TMDB erreur pour l'id ${tmdbId}: ${j.status_message || res.statusText || JSON.stringify(j)}`
    );
  }
  if (!j.poster_path) {
    throw new Error(`TMDB : pas d'affiche (poster_path) pour l'id ${tmdbId}`);
  }
  const posterUrl = `${TMDB_IMG}/w500${j.poster_path}`;
  const backdropPath = j.backdrop_path || j.poster_path;
  const backdropUrl = `${TMDB_IMG}/w1280${backdropPath}`;
  return { posterUrl, backdropUrl };
}

async function fetchBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Téléchargement HTTP ${res.status} : ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

function publicObjectUrl(key) {
  return `${PUBLIC_BASE}/${BUCKET}/${encodeURI(key)}`;
}

async function ensureBucket(client) {
  const exists = await client.bucketExists(BUCKET);
  if (!exists) {
    await client.makeBucket(BUCKET, 'us-east-1');
  }
}

async function ensurePublicDownload(client) {
  const policy = JSON.stringify({
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: { AWS: ['*'] },
        Action: ['s3:GetObject'],
        Resource: [`arn:aws:s3:::${BUCKET}/*`],
      },
    ],
  });
  await client.setBucketPolicy(BUCKET, policy);
}

async function uploadPosterBackdrop(client, slug, posterUrl, backdropUrl) {
  const posterKey = `posters/${slug}.jpg`;
  const backdropKey = `backdrops/${slug}.jpg`;

  const [posterBuf, backdropBuf] = await Promise.all([
    fetchBuffer(posterUrl),
    fetchBuffer(backdropUrl),
  ]);

  await client.putObject(BUCKET, posterKey, posterBuf, posterBuf.length, {
    'Content-Type': 'image/jpeg',
  });
  await client.putObject(BUCKET, backdropKey, backdropBuf, backdropBuf.length, {
    'Content-Type': 'image/jpeg',
  });

  return {
    poster_url: publicObjectUrl(posterKey),
    backdrop_url: publicObjectUrl(backdropKey),
  };
}

async function buildRows() {
  const rows = [];

  if (skipMinio) {
    for (const m of movies) {
      const { posterUrl, backdropUrl } = await fetchTmdbSources(m.tmdbId);
      rows.push({
        title: m.title,
        synopsis: m.synopsis,
        poster_url: posterUrl,
        backdrop_url: backdropUrl,
        release_year: m.release_year,
        genre: m.genre,
        rating: m.rating,
        duration_minutes: m.duration_minutes,
        is_featured: m.is_featured,
        video_url: null,
      });
    }
    return rows;
  }

  const client = new Minio.Client(minioConfig);
  await ensureBucket(client);
  await ensurePublicDownload(client);

  for (const m of movies) {
    const { posterUrl, backdropUrl } = await fetchTmdbSources(m.tmdbId);
    const urls = await uploadPosterBackdrop(client, m.slug, posterUrl, backdropUrl);
    rows.push({
      title: m.title,
      synopsis: m.synopsis,
      poster_url: urls.poster_url,
      backdrop_url: urls.backdrop_url,
      release_year: m.release_year,
      genre: m.genre,
      rating: m.rating,
      duration_minutes: m.duration_minutes,
      is_featured: m.is_featured,
      video_url: null,
    });
  }
  return rows;
}

async function main() {
  let rows;
  try {
    rows = await buildRows();
  } catch (e) {
    console.error('Échec préparation du catalogue :', e.message);
    if (e.message.includes('TMDB_API_KEY')) {
      console.error(
        'Créez une clé API gratuite sur https://www.themoviedb.org/settings/api puis ajoutez TMDB_API_KEY dans backend/.env'
      );
    } else if (!skipMinio) {
      console.error(
        'Vérifiez aussi que MinIO tourne (docker compose up -d minio) et que le port',
        `${minioConfig.endPoint}:${minioConfig.port} est joignable.`
      );
    }
    process.exitCode = 1;
    await pool.end();
    return;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM movies');
    for (const row of rows) {
      await client.query(insertSql, [
        row.title,
        row.synopsis,
        row.poster_url,
        row.backdrop_url,
        row.release_year,
        row.genre,
        row.rating,
        row.duration_minutes,
        row.is_featured,
        row.video_url ?? null,
      ]);
    }
    await client.query('COMMIT');
    const mode = skipMinio ? 'URLs TMDB (sans MinIO)' : 'jaquettes TMDB stockées dans MinIO';
    console.log(`Catalogue réinséré : ${rows.length} films (${mode}).`);
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(e);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();

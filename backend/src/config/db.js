import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

// Configuration de la connexion à PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'netflix_clone',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
  options: '-c client_encoding=UTF8',
});

// Test rapide de la connexion au démarrage
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err.stack);
  } else {
    console.log('Connecté à la base de données PostgreSQL.');
  }
});

export default pool;

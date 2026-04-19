import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import movieRoutes from './routes/movieRoutes.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
// /api/auth pour register & login
app.use('/api/auth', authRoutes);
// /api/users pour le profil
app.use('/api/users', userRoutes);
// /api/movies catalogue (JWT requis)
app.use('/api/movies', movieRoutes);

// Middleware global de gestion des erreurs
app.use((err, req, res, next) => {
  console.error("Erreur serveur:", err.stack);
  res.status(500).json({ error: 'Une erreur interne est survenue sur le serveur' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur le port ${PORT}`);
});

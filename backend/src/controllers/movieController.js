import * as movieModel from '../models/movieModel.js';

export const getMovies = async (req, res) => {
  try {
    const { genre } = req.query;
    const movies = genre
      ? await movieModel.findByGenre(String(genre))
      : await movieModel.findAll();
    const genres = await movieModel.listGenres();
    const featured = await movieModel.findFeatured();
    res.json({ movies, genres, featured });
  } catch (err) {
    console.error('Erreur getMovies:', err);
    res.status(500).json({ message: 'Impossible de charger le catalogue.' });
  }
};

export const getMovieById = async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(id) || id < 1) {
      return res.status(400).json({ message: 'Identifiant de film invalide.' });
    }
    const movie = await movieModel.findById(id);
    if (!movie) {
      return res.status(404).json({ message: 'Film introuvable.' });
    }
    res.json({ movie });
  } catch (err) {
    console.error('Erreur getMovieById:', err);
    res.status(500).json({ message: 'Impossible de charger le film.' });
  }
};

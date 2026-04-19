import express from 'express';
import { getMovies, getMovieById } from '../controllers/movieController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getMovies);
router.get('/:id', protect, getMovieById);

export default router;

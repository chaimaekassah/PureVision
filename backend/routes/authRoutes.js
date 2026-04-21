const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const { register, login } = require('../controllers/authController.js');

router.post(
  '/register',
  [
    body('nom').notEmpty().withMessage('Le nom est requis'),
    body('email').isEmail().withMessage('Veuillez fournir un email valide'),
    body('mot_de_passe').isLength({ min: 6 }).withMessage('Le mot de passe doit faire au moins 6 caractères')
  ],
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Veuillez fournir un email valide'),
    body('mot_de_passe').exists().withMessage('Le mot de passe est requis')
  ],
  login
);

module.exports = router;
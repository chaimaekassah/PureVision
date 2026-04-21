const express = require('express');
const router = express.Router();

const { getProfile, updateProfile } = require('../controllers/userController.js');
const { protect } = require('../middlewares/authMiddleware.js');
const { authorizeRoles } = require('../middlewares/roleMiddleware.js');

router.route('/profile')
  .get(protect, getProfile)
  .put(protect, updateProfile);

router.get('/admin', protect, authorizeRoles('admin'), (req, res) => {
  res.json({ message: "Bienvenue sur la zone admin sécurisée !" });
});

module.exports = router;
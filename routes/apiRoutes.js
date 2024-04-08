// apiRoutes.js
const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

// Route pour la racine de l'API (GET)
router.get('/', (req, res) => {
    res.json({ message: 'Bienvenue sur l\'API !' });
});

router.get('/user', apiController.getUser);

// Autres routes ici...

module.exports = router;
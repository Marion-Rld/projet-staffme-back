const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route pour la racine de l'API (GET)
router.get('/', (req, res) => {
    res.json({ message: 'Bienvenue sur l\'API !' });
});

router.get('/user', userController.getUser);
router.post('/user', userController.createUser);
router.get('/user/:id', userController.getUserById);
router.patch('/user/:id', userController.updateUser);
router.delete('/user/:id', userController.deleteUser);

// Autres routes ici...

module.exports = router;

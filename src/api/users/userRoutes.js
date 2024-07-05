const express = require('express');
const router = express.Router();
const usersController = require('./usersController');

// Route pour la racine de l'API (GET)
router.get('/', (req, res) => {
    res.json({ message: 'Bienvenue sur l\'API User !' });
});

router.get('/users', usersController.getUsers);
router.post('/user', usersController.createUser);
router.get('/user/:id', usersController.getUserById);
router.patch('/user/:id', usersController.updateUser);
router.delete('/user/:id', usersController.deleteUser);

module.exports = router;
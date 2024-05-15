const express = require('express');
const router = express.Router();
const teamsController = require('./teamsController');

// Route pour la racine de l'API (GET)
router.get('/', (req, res) => {
    res.json({ message: 'Bienvenue sur l\'API Team !' });
});

router.get('/teams', teamsController.getTeams);
router.post('/team', teamsController.createTeam);
router.get('/team/:id', teamsController.getTeamById);
router.patch('/team/:id', teamsController.updateTeam);
router.delete('/team/:id', teamsController.deleteTeam);

module.exports = router;

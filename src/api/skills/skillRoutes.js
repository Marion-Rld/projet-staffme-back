const express = require('express');
const router = express.Router();
const skillsController = require('./skillsController');

// Route pour la racine de l'API (GET)
router.get('/', (req, res) => {
    res.json({ message: 'Bienvenue sur l\'API skill !' });
});

// Routes pour les skills
router.get('/skills', skillsController.getSkills);
router.post('/skill', skillsController.createSkill);
router.get('/skill/:id', skillsController.getSkillById);
router.patch('/skill/:id', skillsController.updateSkill);
router.delete('/skill/:id', skillsController.deleteSkill);

module.exports = router;
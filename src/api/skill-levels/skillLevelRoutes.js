const express = require('express');
const router = express.Router();
const skillLevelsController = require('./skillLevelsController');

// Route pour la racine de l'API (GET)
router.get('/', (req, res) => {
    res.json({ message: 'Bienvenue sur l\'API Skill Level !' });
});

router.get('/skill-levels', skillLevelsController.getSkillLevels);
router.post('/skill-level', skillLevelsController.createSkillLevel);
router.get('/skill-level/:id', skillLevelsController.getSkillLevelById);
router.patch('/skill-level/:id', skillLevelsController.updateSkillLevel);
router.delete('/skill-level/:id', skillLevelsController.deleteSkillLevel);

module.exports = router;

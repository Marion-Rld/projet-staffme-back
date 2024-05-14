const express = require('express');
const router = express.Router();
const skillLevelsController = require('../controllers/skillLevelsController');

// Route pour la racine de l'API (GET)
router.get('/', (req, res) => {
    res.json({ message: 'Bienvenue sur l\'API Skill Level !' });
});

router.get('/skill_levels', skillLevelsController.getSkillLevels);
router.post('/skill_level', skillLevelsController.createSkillLevel);
router.get('/skill_level/:id', skillLevelsController.getSkillLevelById);
router.patch('/skill_level/:id', skillLevelsController.updateSkillLevel);
router.delete('/skill_level/:id', skillLevelsController.deleteSkillLevel);

module.exports = router;

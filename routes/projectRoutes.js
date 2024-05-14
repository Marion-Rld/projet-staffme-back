const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/projectsController');

// Route pour la racine de l'API (GET)
router.get('/', (req, res) => {
    res.json({ message: 'Bienvenue sur l\'API Project !' });
});

router.get('/projects', projectsController.getProjects);
router.post('/project', projectsController.createProject);
router.get('/project/:id', projectsController.getProjectById);
router.patch('/project/:id', projectsController.updateProject);
router.delete('/project/:id', projectsController.deleteProject);

module.exports = router;

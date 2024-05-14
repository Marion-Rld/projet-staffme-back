const express = require('express');
const userRoutes = require('./userRoutes');
const skillRoutes = require('./skillRoutes');
const teamRoutes = require('./teamRoutes');
const projectRoutes = require('./projectRoutes');
const documentRoutes = require('./documentRoutes');
const skillLevelRoutes = require('./skillLevelRoutes');
const router = express.Router();

router.use('/users-api', userRoutes);
router.use('/skills-api', skillRoutes);
router.use('/teams-api', teamRoutes);
router.use('/projects-api', projectRoutes);
router.use('/documents-api', documentRoutes);
router.use('/skill-levels-api', skillLevelRoutes);

module.exports = router;
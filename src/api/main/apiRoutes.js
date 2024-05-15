const express = require('express');
const userRoutes = require('../users/userRoutes');
const skillRoutes = require('../skills/skillRoutes');
const teamRoutes = require('../teams/teamRoutes');
const projectRoutes = require('../projects/projectRoutes');
const documentRoutes = require('../documents/documentRoutes');
const skillLevelRoutes = require('../skill-levels/skillLevelRoutes');
const authRoutes = require('../users/auth/authRoutes');
const router = express.Router();

router.use('/users-api', userRoutes);
router.use('/skills-api', skillRoutes);
router.use('/teams-api', teamRoutes);
router.use('/projects-api', projectRoutes);
router.use('/documents-api', documentRoutes);
router.use('/skill-levels-api', skillLevelRoutes);
router.use('/auth-api', authRoutes);

module.exports = router;
const express = require('express');
const userRoutes = require('./userRoutes');
const skillRoutes = require('./skillRoutes');
const router = express.Router();

router.use('/users-api', userRoutes);
router.use('/skills-api', skillRoutes);

module.exports = router;
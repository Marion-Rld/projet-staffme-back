const express = require('express');
const router = express.Router();
const authController = require('./authController');
const { authMiddleware } = require('./authMiddleware');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/validate-token', authMiddleware, authController.validateToken);

module.exports = router;
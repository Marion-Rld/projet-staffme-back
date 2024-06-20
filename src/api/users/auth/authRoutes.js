const express = require('express');
const router = express.Router();
const authController = require('./authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/validate-token', authMiddleware, authController.validateToken);

module.exports = router;
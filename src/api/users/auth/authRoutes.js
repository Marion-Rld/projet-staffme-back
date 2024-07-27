const express = require('express');
const router = express.Router();
const authController = require('./authController');
const { authMiddleware } = require('./authMiddleware');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/validate-token', authMiddleware, authController.validateToken);
router.post('/forgot-password', authController.forgotPassword);
router.get('/is-admin', authMiddleware, authController.isAdmin);
router.get('/is-superadmin', authMiddleware, authController.isSuperAdmin);
router.get('/reset-password/:token', authController.getResetPassword); // Nouvelle route GET
router.post('/reset-password/:token', authController.resetPassword);

module.exports = router;
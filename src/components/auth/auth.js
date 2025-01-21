const express = require ('express');
const router =express.Router();

const AuthController= require('./controllers/AuthController');
const {ensureAuthenticated, ensureLogin } = require('@AuthMiddleware');

router.get('/',AuthController.home); 
router.get('/registration',AuthController.viewRegistration);
router.post('/register',AuthController.register);
router.get('/login',AuthController.viewLogin);
router.post('/login',AuthController.login);
router.get('/auth/google', AuthController.authenticateGoogle);
router.get('/auth/google/callback', AuthController.authenticateGoogleCallback);


router.get('/confirm/:token', AuthController.confirmAccount);
router.get('/verify', ensureLogin, AuthController.waitingForConfirmation);
router.get('/check-confirmation',ensureLogin, AuthController.checkConfirmation);
router.post('/resend-confirmation',ensureLogin, AuthController.reSendConfirmation);
router.get('/logout',AuthController.logout);

// Route cho chức năng quên mật khẩu
router.get('/forgot-password', AuthController.viewForgotPassword);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/verify-code', AuthController.verifyCode);
router.get('/reset-password/:token', AuthController.viewResetPassword);
router.post('/reset-password/:token', AuthController.resetPassword);
router.get('/logout',AuthController.logout);


module.exports = router;
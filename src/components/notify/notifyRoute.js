const express = require ('express');
const router =express.Router();
const {ensureAuthenticated, ensureLogin } = require('@AuthMiddleware');

const notifyController= require('./controllers/NotifyController');
 
router.post('/subscribe', ensureLogin, notifyController.subscribe);
router.post('/send-notification', notifyController.sendNotification);



module.exports = router;
const express = require ('express');
const router =express.Router();
const orderController=require('./controllers/OrderController');
const {ensureAuthenticated} = require('../../middlewares/AuthMiddleware');

router.get('/',orderController.ViewProductCheckout);
router.get('/checkout', ensureAuthenticated,orderController.ViewProductCheckout);
router.post('/checkout', ensureAuthenticated,orderController.addOrder);
router.get('/list',ensureAuthenticated,orderController.ViewOrderList);
router.get('/detail/:_id',ensureAuthenticated,orderController.ViewOrderDetail);

// router.get('/payment', ensureAuthenticated,orderController.viewPayment);
// router.post('/payment', ensureAuthenticated,orderController.processPayment);

module.exports = router;
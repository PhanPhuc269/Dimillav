const express = require ('express');
const router =express.Router();
const cartController=require('./controllers/CartController');
const {ensureAuthenticated} = require('../../middlewares/AuthMiddleware');



router.get('/',cartController.ViewShoppingCart);

// Route đồng bộ giỏ hàng từ local storage với database
router.post('/sync', ensureAuthenticated,cartController.syncCart);

// Route cập nhật số lượng sản phẩm trong giỏ hàng (batch update)
router.post('/update-batch', ensureAuthenticated,cartController.updateCartBatch);

module.exports = router;
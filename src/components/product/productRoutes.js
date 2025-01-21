const express = require ('express');
const router =express.Router();
const productController= require('./controllers/ProductController');
const {ensureAuthenticated} = require('../../middlewares/AuthMiddleware');

 
router.get('/list',productController.ViewProductListings);
router.get('/product-details/:slug',productController.ViewProductDetails);
router.get('/confirmation', ensureAuthenticated,productController.ViewOrderConfirmation);
router.get('/filter', productController.getFilteredProducts);
router.get('/search', productController.SearchProduct);
router.get('/stock', productController.getStockInfo);

module.exports = router;
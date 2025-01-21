const express = require ('express');
const router =express.Router();

const blogController= require('./controllers/BlogController');

router.get('/',blogController.blog); 
router.get('/single-blog',blogController.details);



module.exports = router;
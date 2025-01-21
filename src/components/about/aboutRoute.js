const express = require ('express');
const router =express.Router();

const aboutController= require('./controllers/AboutController');

router.get('/',aboutController.about);


module.exports = router;
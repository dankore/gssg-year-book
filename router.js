const express = require('express');
const router = express.Router();
const controller = require('./controller');


router.get('/', controller.home);
router.get('/register', controller.register);
router.post('/create-profile', controller.createProfile);

module.exports = router;
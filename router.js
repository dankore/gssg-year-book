const express = require('express');
const router = express.Router();
const controller = require('./controller')


router.get('/', controller.home);
router.post('/create-profile', controller.createProfile)

module.exports = router;
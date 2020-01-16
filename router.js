const express = require('express');
const router = express.Router();
const controller = require('./controller');


router.get('/', controller.home);
router.get('/register', controller.registrationPage);
router.post('/register', controller.registrationSubmission);

module.exports = router;
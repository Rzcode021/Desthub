const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../models/user.js');
const review = require('../models/review.js');
const passport = require('passport');
const wrapAsync = require('../utils/wrapAsync');
const { savedUrl } = require('../middleware.js');
const userController = require('../contollers/user.js');
const user = require('../models/user.js');

router.get('/signup', userController.renderSignupForm);

router.post('/signup', wrapAsync(userController.signUP));

router.get('/login', userController.renderLoginForm);

router.post('/login',savedUrl, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), userController.logIn);

router.get('/logout', userController.logout);









module.exports = router;
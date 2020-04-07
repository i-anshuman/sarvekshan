const express  = require('express');
const passport = require('passport');
const router   = express.Router();
const { verifyLoginInputs } = require('../utils/middlewares');

router.post('/', verifyLoginInputs, passport.authenticate("local", {
  failureRedirect: '/error',
  successRedirect: '/profile',
  failureFlash: "Incorrect email or password"
}));

module.exports = router;

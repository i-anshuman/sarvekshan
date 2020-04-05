const express  = require('express');
const passport = require('passport');
const router   = express.Router();

router.post('/', passport.authenticate("local", {
  failureRedirect: '/error',
  successRedirect: '/profile'
}));

module.exports = router;

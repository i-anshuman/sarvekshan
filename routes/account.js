'use strict';

const router   = require('express').Router();
const { watchError } = require('../middlewares');
const { sign, verify } = require('../utils/jwt');
const { signup, signin }   = require('../controllers/account');
const { valiateSignupInputs, valiateSigninInputs } = require('../validators/account');

router.post('/signup', valiateSignupInputs(), watchError, (req, res) => {
  const { fullname, email, password } = { ...req.body };
  signup(fullname, email, password, (error, result) => {
    error
      ? res.status(400).json({ error })
      : res.status(200).json({ result });
  });
});

router.post('/signin', valiateSigninInputs(), watchError, (req, res) => {
  const { email, password } = { ...req.body };
  signin(email, password, (error, result) => {
    if (error) {
      return res.status(400).json({ error: "Incorrect email or password." })
    }
    sign(result)
      .then(token => 
        res
          .status(200)
          .cookie('token', token, {
            signed: true,
            httpOnly: true,
            expires: new Date(Date.now() + 12 * 3600 * 1000)
          })
          .json({ message: "Authentication successfull." })
      )
      .catch(error => res.status(400).json({ error }));
  });
});

router.post('/verify', (req, res) => {
  req.signedCookies.token
    ? verify(req.signedCookies.token)
        .then(data => res.status(200).json({ data }))
        .catch(error => res.status(400).json({ error }))
    : res.status(401).json({ error: "Unauthorised" });
});

router.get('/signout', (req, res) => {
  res
    .status(200)
    .cookie('token', "", {
      signed: true,
      httpOnly: true,
      expires: new Date(Date.now())
    })
    .json({ message: "Deauthentication successfull." })
});

module.exports = router;

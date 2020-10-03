'use strict';

const { verify } = require('../utils/jwt');
const { validationResult } = require('express-validator');

const watchErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = {};
    errors.array().map(({param, msg}) => {
      extractedErrors[param] = msg
    });
    return res.status(422).json({ errors: extractedErrors });
  }
  next();
};

const ensureAuthenticated = (req, res, next) => {
  req.signedCookies.token
    ? verify(req.signedCookies.token)
        .then(data => {
          res.locals.user = data;
          next();
        })
        .catch(error => res.status(401).json({ error: "Unauthenticated", desc: error }))
    : res.status(401).json({ error: "Unauthenticated" });
};

const notFound = (req, res) => {
  res.status(404).json({ error: "404 Not Found!!" });
};

module.exports = { watchErrors, ensureAuthenticated, notFound };

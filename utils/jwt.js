'use strict';

const jwt = require('jsonwebtoken');

const sign = payload => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload.toJSON(),
      process.env.TOKEN_SECRET,
      { expiresIn: "12h", algorithm: "HS512" },
      (error, token) => {
        error
          ? reject(error)
          : resolve(token);
      }
    );
  });
};

const verify = token => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      process.env.TOKEN_SECRET,
      { algorithm: "HS512" },
      (error, payload) => {
        error
          ? reject(error)
          : resolve(payload);
      }
    );
  });
};

module.exports = { sign, verify };

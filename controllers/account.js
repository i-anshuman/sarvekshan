'use strict';

const bcrypt = require('bcrypt');
const Users  = require('../models/users');

const signup = (fullname, email, password, callback) => {
  Users.findOne({ email }, (error, user) => {
    if (error) {
      callback(error);
    }
    if (user) {
      callback("User already exist.");
    }
    else {
      const newUser = new Users({
        email,
        fullname,
        password: bcrypt.hashSync(password, 12)
      });
      newUser.save((error, savedUser) => {
        callback(error, savedUser);
      });
    }
  });
};

const signin = (email, password, callback) => {
  Users.findOneAndUpdate({ email }, { lastLogin: Date.now() }, {new: true}, (error, user) => {
    if (error) {
      callback(error);
    }
    if (!user) {
      callback("User not found.");
    }
    else if (!bcrypt.compareSync(password, user.password)) {
      callback("Incorrect password.");
    }
    else {
      callback(null, user);
    }
  });
};

module.exports = { signup, signin };

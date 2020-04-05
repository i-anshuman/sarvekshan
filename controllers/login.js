const bcrypt = require('bcrypt');
const Users  = require('../models/users');

const login = (email, password, callback) => {
  Users.findOne({ email: email }, (error, user) => {
    if (error) {
      callback(error);
    }
    if (!user) {
      callback("User not found.");
    }
    else if (!bcrypt.compareSync(password, hash)) {
      callback("Incorrect Password.");
    }
    else {
      callback(null, user);
    }
  });
}

module.exports = login;

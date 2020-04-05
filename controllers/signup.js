const bcrypt = require('bcrypt');
const Users  = require('../models/users');

const signup = (fullname, email, password, callback) => {
  Users.findOne({ email: email }, (error, user) => {
    if (error) {
      callback(error);
    }
    if (user) {
      callback("User already exist.");
    }
    else {
      const newUser = new Users({
        fullname: fullname,
        email: email,
        password: bcrypt.hashSync(password, 10)
      });
      newUser.save((error, savedUser) => {
        if (error) {
          callback(error);
        }
        else {
          callback(null, savedUser);
        }
      });
    }
  });
}

module.exports = signup;

const bcrypt        = require('bcrypt');
const passport      = require('passport');
const mongoose      = require('mongoose');
const LocalStrategy = require('passport-local');
const ObjectID      = mongoose.Types.ObjectId;
const Users         = require('../models/users');

const authentication = () => {
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((userID, done) => {
    Users.findOne({ _id: new ObjectID(userID) }, (error, user) => {
      done(error, user);
    });
  });

  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    (email, password, done) => {
      Users.findOneAndUpdate({ email: email }, { lastLogin: Date.now() }, {new: true}, (error, user) => {
        if (error) {
          done(error);
        }
        if (!user) {
          done(null, false, { message: "User not found." });
        }
        else if (!bcrypt.compareSync(password, user.password)) {
          done(null, false, { message: "Incorrect Password." });
        }
        else {
          done(null, user);
        }
      }
    );
  }));
}

module.exports = authentication;

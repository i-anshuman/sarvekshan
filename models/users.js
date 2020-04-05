const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const users = new Schema({
  fullname: {
    type: String,
    required: true,
    maxlength: [50, 'Fullname too long']
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  profile: {
    type: String,
    default: "image url"
  },
  joinedOn: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Users', users);

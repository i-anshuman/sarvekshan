const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const options = new Schema({
  option: {
    type: String,
    required: true
  },
  textbox: {
    type: Boolean,
    default: false
  }
});

module.exports = options;

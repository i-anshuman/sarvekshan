const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const Options  = require('./options');

const questions = new Schema({
  question: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  options: [ Options ]
});

module.exports = questions;

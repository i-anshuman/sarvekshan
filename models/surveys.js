const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;
const Questions = require('./questions');

const surveys = new Schema({
  creatorID: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    minlength: [100, 'Description too short'],
    maxlength: [200, 'Description too long']
  },
  createdOn: {
    type: Date,
    default: Date.now,
    required: true
  },
  validity: {
    type: Date,
    required: true
  },
  published: {
    type: Boolean,
    required: true,
    default: false
  },
  questions: [ Questions ]
});

module.exports = new mongoose.model('Surveys', surveys);

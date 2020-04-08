const Users   = require('../models/users');
const Surveys = require('../models/surveys');

const add = (survey, callback) => {
  Users.findOne({ _id: survey.creatorID }, (error, user) => {
    if (error) {
      callback(error);
    }
    if (!user) {
      callback("Invalid user id.");
    }
    else {
      const newSurvey = new Surveys(survey);
      newSurvey.save((error, savedSurvey) => {
        if (error) {
          callback(error);
        }
        else {
          callback(null, savedSurvey);
        }
      });
    }
  });
}

module.exports = { add };

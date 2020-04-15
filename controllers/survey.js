const Users    = require('../models/users');
const Surveys  = require('../models/surveys');
const mongoose = require('mongoose');
const ObjectID = mongoose.Types.ObjectId;

const add = (survey, callback) => {
  Users.findOne({ _id: new ObjectID(survey.creatorID) }, (error, user) => {
    if (error) {
      callback(error);
    }
    if (!user) {
      callback("Invalid user id.");
    }
    else {
      const newSurvey = new Surveys(survey);
      newSurvey.save((error, savedSurvey) => {
        callback(error, savedSurvey);
      });
    }
  });
}

const view = (surveyID, userID, callback) => {
  Surveys.findOne(
    { _id: new ObjectID(surveyID), creatorID: new ObjectID(userID) }, 
    (error, survey) => {
      callback(error, survey);
    }
  );
}

const list = (userID, callback) => {
  Surveys.find({ creatorID: new ObjectID(userID) }, (error, surveys) => {
    callback(error, surveys);
  });
}

const publish = (surveyID, userID, state, callback) => {
  Surveys.findOneAndUpdate(
    { _id: new ObjectID(surveyID), creatorID: new ObjectID(userID) }, 
    { published: state }, 
    { new: true }, 
    (error, survey) => {
      callback(error, survey);
    }
  );
}

const del = (surveyID, userID, callback) => {
  Surveys.deleteOne(
    { _id: new ObjectID(surveyID), creatorID: new ObjectID(userID) },
    (error, survey) => {
      callback(error, survey);
    }
  );
}

const edit = (surveyID, userID, data, callback) => {
  Surveys.findOneAndUpdate(
    { _id: new ObjectID(surveyID), creatorID: new ObjectID(userID) },
    data, { new: true },
    (error, survey) => {
      callback(error, survey);
    }
  );
}

const addQuestion = (surveyID, userID, question, callback) => {
  Surveys.findOneAndUpdate(
    { _id: new ObjectID(surveyID), creatorID: new ObjectID(userID) }, 
    { $push: { questions: question } }, 
    { new: true }, 
    (error, survey) => {
      callback(error, survey);
    }
  );
}

const deleteQuestion = (surveyID, userID, questionID, callback) => {
  Surveys.findOneAndUpdate(
    { _id: new ObjectID(surveyID), creatorID: new ObjectID(userID) },
    { $pull: { questions: { _id: questionID } } },
    { new: true },
    (error, survey) => {
      callback(error, survey);
    }
  );
}

module.exports = { add, view, list, publish, del, edit, addQuestion, deleteQuestion };

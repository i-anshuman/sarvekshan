'use strict';

const Surveys  = require('../models/surveys');
const mongoose = require('mongoose');
const ObjectID = mongoose.Types.ObjectId;

const add = (surveyID, userID, questionID, data, callback) => {
  Surveys.findOneAndUpdate(
    { 
      _id: new ObjectID(surveyID),
      creatorID: new ObjectID(userID),
      questions: {
        $elemMatch: {
          _id: questionID
        }
      }
    },
    { $push: { [`questions.$.options`]: data } },
    { new: true },
    (error, survey) => {
      callback(error, survey.questions[0].options);
    }
  );
};

const edit = (surveyID, userID, questionID, optionID, rawData, callback) => {
  const data = {};
  for (const key in rawData) {
    data[`questions.$.options.$[option].${key}`] = rawData[key];
  }
  Surveys.findOneAndUpdate(
    { 
      _id: new ObjectID(surveyID),
      creatorID: new ObjectID(userID),
      questions: {
        $elemMatch: {
          _id: questionID
        }
      }
    },
    { $set: data },
    { arrayFilters: [{ "option._id": new ObjectID(optionID) }], new: true },
    (error, survey) => {
      callback(error, survey.questions[0].options);
    }
  );
};

const del = (surveyID, userID, questionID, optionID, callback) => {
  Surveys.findOneAndUpdate(
    { _id: new ObjectID(surveyID),
      creatorID: new ObjectID(userID),
      questions: {
        $elemMatch: {
          _id: questionID
        }
      }
    },
    { $pull: { [`questions.$.options`]: { _id: optionID } } },
    { new: true },
    (error, survey) => {
      callback(error, survey.questions[0].options);
    }
  );
};

module.exports = { add, del, edit };

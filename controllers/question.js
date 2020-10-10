'use strict';

const Surveys  = require('../models/surveys');
const mongoose = require('mongoose');
const ObjectID = mongoose.Types.ObjectId;

const add = (surveyID, userID, question, callback) => {
  Surveys.findOneAndUpdate(
    { _id: new ObjectID(surveyID), creatorID: new ObjectID(userID) }, 
    { $push: { questions: question } }, 
    { new: true }, 
    (error, survey) => {
      callback(error, survey);
    }
  );
};

const del = (surveyID, userID, questionID, callback) => {
  Surveys.findOneAndUpdate(
    { _id: new ObjectID(surveyID), creatorID: new ObjectID(userID) },
    { $pull: { questions: { _id: questionID } } },
    { new: true },
    (error, survey) => {
      callback(error, survey);
    }
  );
};

const edit = (surveyID, userID, questionID, rawData, callback) => {
  const data = {};
  for (const key in rawData) {
    if (['question', 'type'].includes(key)) {
      data[`questions.$.${key}`] = rawData[key];
    }
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
    { new: true },
    (error, survey) => {
      callback(error, survey);
    }
  );
};

const find = (surveyID, userID, questionID, callback) => {
  Surveys.findOne(
    {
      _id: new ObjectID(surveyID),
      creatorID: new ObjectID(userID),
      questions: {
        $elemMatch: {
          _id: questionID
        }
      }
    },
    (error, question) => {
      callback(error, question);
    }
  );
};

module.exports = { add, del, edit, find };

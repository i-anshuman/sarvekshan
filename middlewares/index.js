'use strict';

const { verify } = require('../utils/jwt');
const { validationResult } = require('express-validator');
const { view } = require('../controllers/survey');
const { find } = require('../controllers/question');

const watchError = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = {};
    errors.array().map(({param, msg}) => {
      extractedErrors[param] = msg
    });
    return res.status(422).json({ errors: extractedErrors });
  }
  next();
};

const ensureAuthenticated = (req, res, next) => {
  req.signedCookies.token
    ? verify(req.signedCookies.token)
        .then(data => {
          res.locals.user = data;
          next();
        })
        .catch(error => res.status(401).json({ error: "Unauthenticated", desc: error }))
    : res.status(401).json({ error: "Unauthenticated" });
};

const notFound = (req, res) => {
  res.status(404).json({ error: "404 Not Found!!" });
};

const isPublishable = (req, res, next) => {
  const surveyID = req.params.surveyID;
  const userID = res.locals.user._id;
  const state = req.params.state === 'true';
  view(surveyID, userID, (error, survey) => {
    if (error) {
      return res.status(400).json({ error });
    }
    if (!survey) {
      return res.status(404).json({ error: "Survey not found." });
    }
    if (state && survey.questions.length === 0) {
      return res.status(400).json({ error: "Survey must have at least one question, to be published." });
    }
    else if (state && survey.published) {
      return res.status(400).json({ error: "Survey is already publihed." });
    }
    next();
  });
};

const doesSurveyExist = (req, res, next) => {
  const surveyID = req.params.surveyID;
  const userID = res.locals.user._id;
  view(surveyID, userID, (error, survey) => {
    if (error) {
      return res.status(400).json({ error });
    }
    if (!survey) {
      return res.status(404).json({ error: "Survey not found." });
    }
    next();
  });
};

const doesQuestionExist = (req, res, next) => {
  const userID = res.locals.user._id;
  const surveyID = req.params.surveyID;
  const questionID = req.params.questionID;
  find(surveyID, userID, questionID, (error, question) => {
    if (error) {
      return res.status(400).json({ error });
    }
    if (!question) {
      return res.status(404).json({ error: "Question not found." });
    }
    next();
  });
};

module.exports = {
  notFound,
  watchError,
  isPublishable,
  doesSurveyExist,
  doesQuestionExist,
  ensureAuthenticated
};

'use strict';

const router  = require('express').Router();
const { add, list, view, publish, del, edit } = require('../controllers/survey');
const { watchError, isPublishable, doesSurveyExist } = require('../middlewares');
const {
  validateIDs,
  valiateSurveyInputs,
  validatePublishStatus,
  validateSurveyEditInputs
} = require('../validators/survey');
const question = require('./question');

router.post('/new', valiateSurveyInputs(), watchError, (req, res) => {
  const { title, description, validityDate, validityTime } = { ...req.body };
  const survey = {
    creatorID: res.locals.user._id,
    title,
    description,
    validity: `${validityDate}T${validityTime}`,
  };
  add(survey, (error, result) => {
    error
      ? res.status(400).json({error})
      : res.status(201).json({result});
  });
});

router.get('/list', (req, res) => {
  list(res.locals.user._id, (error, surveys) => {
    error
      ? res.status(400).json({error})
      : res.status(200).json({surveys});
  });
});

router.get('/view/:surveyID', validateIDs('surveyID'), watchError, (req, res) => {
  const surveyID = req.params.surveyID;
  const userID = res.locals.user._id;
  view(surveyID, userID, (error, survey) => {
    error
      ? res.status(400).json({error})
      : survey
          ? res.status(200).json({survey})
          : res.status(404).json({error: "Survey not found."});
  });
});

router.patch('/publish/:surveyID/:state?',
  validateIDs('surveyID'), validatePublishStatus(),
  watchError, isPublishable, 
  (req, res) => {
    const surveyID = req.params.surveyID;
    const userID = res.locals.user._id;
    const state = req.params.state;
    publish(surveyID, userID, state, (error, survey) => {
      error
        ? res.status(400).json({error})
        : res.status(200).json({survey});
    });
  }
);

router.patch('/edit/:surveyID', validateIDs('surveyID'),
  validateSurveyEditInputs(), watchError,
  (req, res) => {
    const surveyID = req.params.surveyID;
    const userID = res.locals.user._id;
    const data = { ...req.body };
    const { validityDate, validityTime } = { ...req.body };
    if (validityDate && validityTime) {
      data.validity = `${validityDate}T${validityTime}`;
    }
    edit(surveyID, userID, data, (error, survey) => {
      error
          ? res.status(400).json({error})
          : res.status(200).json({survey});
    });
  }
);

router.delete('/delete/:surveyID', validateIDs('surveyID'), watchError, (req, res) => {
  const surveyID = req.params.surveyID;
  const userID = res.locals.user._id;
  del(surveyID, userID, (error, {deletedCount}) => {
    error
        ? res.status(400).json({error})
        : res.status(200).json({deletedCount});
  });
});

router.use('/:surveyID/question', 
  validateIDs('surveyID'),
  watchError,
  doesSurveyExist,
  question
);

module.exports = router;

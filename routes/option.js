'use strict';

const router = require('express').Router({mergeParams: true});
const { watchError } = require('../middlewares');
const { validateIDs } = require('../validators/survey');
const { validateOptionInputs } = require('../validators/option');
const { add, del, edit } = require('../controllers/option');

router.post('/add', validateOptionInputs(), watchError, (req, res) => {
  const userID = res.locals.user._id;
  const surveyID = req.params.surveyID;
  const questionID = req.params.questionID;
  add(surveyID, userID, questionID, { ...req.body }, (error, options) => {
    error
      ? res.status(400).json({error})
      : res.status(200).json({options});
  });
});

router.delete('/:optionID/delete', validateIDs('optionID'), watchError, (req, res) => {
  const userID = res.locals.user._id;
  const surveyID = req.params.surveyID;
  const optionID = req.params.optionID;
  const questionID = req.params.questionID;
  del(surveyID, userID, questionID, optionID, (error, options) => {
    error
      ? res.status(400).json({error})
      : res.status(200).json({options});
  });
});

router.patch('/:optionID/edit', 
  validateIDs('optionID'),
  validateOptionInputs(),
  watchError,
  (req, res) => {
    const userID = res.locals.user._id;
    const surveyID = req.params.surveyID;
    const optionID = req.params.optionID;
    const questionID = req.params.questionID;
    edit(surveyID, userID, questionID, optionID, { ...req.body }, (error, options) => {
      error
        ? res.status(400).json({error})
        : res.status(200).json({options});
    });
  }
);

module.exports = router;

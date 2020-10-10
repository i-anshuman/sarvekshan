'use strict';

const router = require('express').Router({mergeParams: true});
const optionRouter = require('./option');
const { watchError, doesQuestionExist } = require('../middlewares');
const { validateIDs } = require('../validators/survey');
const { add, del, edit } = require('../controllers/question');
const { validateQuestionInputs, validateQuestionEditInputs } = require('../validators/question');

router.post('/add', validateQuestionInputs(), watchError, (req, res) => {
  const surveyID = req.params.surveyID;
  const userID = res.locals.user._id;
  const { question, type, textbox } = { ...req.body };
  const options = (req.body.options).map((option, index) => (
    (textbox && index === req.body.options.length - 1)
      ? { option, textbox: true }
      : { option }
  ));
  add(surveyID, userID, { question, type, options }, (error, survey) => {
    error
      ? res.status(400).json({error})
      : res.status(200).json({survey});
  });
});

router.delete('/delete/:questionID',
  validateIDs('questionID'), watchError,
  (req, res) => {
    const userID = res.locals.user._id;
    const surveyID = req.params.surveyID;
    const questionID = req.params.questionID;
    del(surveyID, userID, questionID, (error, survey) => {
      error
        ? res.status(400).json({error})
        : res.status(200).json({survey});
    });
  }
);

router.patch('/edit/:questionID',
  validateIDs('questionID'),
  validateQuestionEditInputs(), 
  watchError, doesQuestionExist,
  (req, res) => {
    const userID = res.locals.user._id;
    const surveyID = req.params.surveyID;
    const questionID = req.params.questionID;
    edit(surveyID, userID, questionID, { ...req.body }, (error, survey) => {
      error
        ? res.status(400).json({error})
        : res.status(200).json({survey});
    });
  }
);

router.use('/:questionID/option',
  validateIDs('questionID'),
  watchError,
  doesQuestionExist,
  optionRouter
);

module.exports = router;

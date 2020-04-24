const express = require('express');
const router  = express.Router();
const { add, list, view, addQuestion, publish, del, edit, deleteQuestion } = require('../controllers/survey');
const { ensureAuthenticated, verifySurveyInputs, verifyID, verifyQuestionInputs, isPublishable, isPublished, verifyEditInputs } = require('../utils/middlewares');

router.post('/new', ensureAuthenticated, verifySurveyInputs, (req, res) => {
  const { validityDate, validityTime } = { ...req.body };
  const newSurvey = {
    creatorID: req.user._id,
    title: req.body.title,
    description: req.body.description,
    validity: `${validityDate}T${validityTime}`,
  };
  add(newSurvey, (error, result) => {
    if (error) {
      res.json({ error });
    }
    else {
      res.json({ result });
    }
  });
});

router.get('/view/:surveyID', ensureAuthenticated, verifyID, (req, res) => {
  const surveyID = req.params.surveyID;
  const userID = req.user._id;
  view(surveyID, userID, (error, survey) => {
    if (error) {
      res.json({ error });
    }
    else {
      res.json({ survey });
    }
  });
});

router.get('/list', ensureAuthenticated, (req, res) => {
  list(req.user._id, (error, surveys) => {
    if (error) {
      res.json({ error });
    }
    else {
      res.json({ surveys });
    }
  });
});

router.get('/publish/:surveyID/:state?', ensureAuthenticated, verifyID, isPublishable, (req, res) => {
  const surveyID = req.params.surveyID;
  const userID = req.user._id;
  const state = req.params.state ? true : false;
  publish(surveyID, userID, state, (error, survey) => {
    if (error) {
      res.json({ error });
    }
    else {
      res.json({ survey });
    }
  });
});

router.post('/status/:surveyID', ensureAuthenticated, verifyID, isPublished);

router.get('/delete/:surveyID', ensureAuthenticated, verifyID, (req, res) => {
  const surveyID = req.params.surveyID;
  const userID = req.user._id;
  del(surveyID, userID, (error, survey) => {
    if (error) {
      res.json({ error });
    }
    else {
      res.json({ survey });
    }
  });
});

router.post('/edit/:surveyID', ensureAuthenticated, verifyID, verifyEditInputs, (req, res) => {
  const surveyID = req.params.surveyID;
  const userID = req.user._id;
  const { field, value } = { ...req.body };
  const data = {};
  switch (field) {
    case "validity":
      const { validityDate, validityTime } = { ...req.body };
      data[field] = `${validityDate}T${validityTime}`;
      break;
    default:
      data[field] = value;
  }
  edit(surveyID, userID, data, (error, survey) => {
    if (error) {
      res.json({ error });
    }
    else {
      res.json({ survey });
    }
  });
});

router.post('/edit/:surveyID/questions/add', ensureAuthenticated, verifyID, verifyQuestionInputs, (req, res) => {
  const surveyID = req.params.surveyID;
  const userID = req.user._id;
  const { question, type, textbox } = { ...req.body };
  let options = [];
  if (Array.isArray(req.body.options)) {
    options = (req.body.options).map((option, index) => {
      return (textbox && index === req.body.options.length - 1) ? { option, textbox: true } : { option };
    });
  }
  else {
    options = [{ option: req.body.options, textbox: true }];
  }
  addQuestion(surveyID, userID, { question, type, options }, (error, survey) => {
    if (error) {
      res.json({ error });
    }
    else {
      res.json({ survey });
    }
  });
});

router.get('/edit/:surveyID/questions/delete/:questionID', ensureAuthenticated, verifyID, (req, res) => {
  const userID = req.user._id;
  const surveyID = req.params.surveyID;
  const questionID = req.params.questionID;
  deleteQuestion(surveyID, userID, questionID, (error, survey) => {
    if (error) {
      res.json({ error });
    }
    else {
      res.json({ survey });
    }
  });
});

module.exports = router;

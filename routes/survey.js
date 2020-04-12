const express = require('express');
const router  = express.Router();
const { add, list, view, addQuestion, publish, del, edit } = require('../controllers/survey');
const { ensureAuthenticated, verifySurveyInputs, verifySurveyID } = require('../utils/middlewares');

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
      res.json({ error: error });
    }
    else {
      res.json({ result });
    }
  });
});

router.get('/view/:surveyID', ensureAuthenticated, verifySurveyID, (req, res) => {
  const surveyID = req.params.surveyID;
  const userID = req.user._id;
  view(surveyID, userID, (error, survey) => {
    if (error) {
      res.json({ error: error });
    }
    else {
      res.json({ survey });
    }
  });
});

router.get('/list', ensureAuthenticated, (req, res) => {
  list(req.user._id, (error, surveys) => {
    if (error) {
      res.json({ error: error });
    }
    else {
      res.json({ surveys });
    }
  });
});

router.get('/publish/:surveyID', ensureAuthenticated, verifySurveyID, (req, res) => {
  const surveyID = req.params.surveyID;
  const userID = req.user._id;
  publish(surveyID, userID, (error, survey) => {
    if (error) {
      res.json({ error: error });
    }
    else {
      res.json({ survey });
    }
  });
});

router.get('/delete/:surveyID', ensureAuthenticated, verifySurveyID, (req, res) => {
  const surveyID = req.params.surveyID;
  const userID = req.user._id;
  del(surveyID, userID, (error, survey) => {
    if (error) {
      res.json({ error: error });
    }
    else {
      res.json({ survey });
    }
  });
});

router.post('/edit/:surveyID', ensureAuthenticated, verifySurveyID, (req, res) => {
  const surveyID = req.params.surveyID;
  const userID = req.user._id;
  const { field, value } = { ...req.body };
  const data = {};
  data[field] = value;
  edit(surveyID, userID, data, (error, survey) => {
    if (error) {
      res.json({ error: error });
    }
    else {
      res.json({ survey });
    }
  });
});

router.post('/edit/:surveyID/addQuestion', ensureAuthenticated, verifySurveyID, (req, res) => {
  const surveyID = req.params.surveyID;
  const userID = req.user._id;
  const { question, type } = { ...req.body };
  const newQuestion = { question, type };
  addQuestion(surveyID, userID, newQuestion, (error, survey) => {
    if (error) {
      res.json({ error: error });
    }
    else {
      res.json({ survey });
    }
  });
});

module.exports = router;

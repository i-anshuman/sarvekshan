const express = require('express');
const router  = express.Router();
const { add } = require('../controllers/survey');
const { ensureAuthenticated, verifySurveyInputs } = require('../utils/middlewares');

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

module.exports = router;

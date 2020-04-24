const { isName, isDate, isTime, isEmail, isTitle, isDescription, isObjectID, isQuestion, isOption, isValidOptionType } = require('./validator');
const { view } = require('../controllers/survey');

const verifyLoginInputs = (req, res, next) => {
  const email = req.body.email;
  if (isEmail(email)) {
    next();
  }
  else {
    res.json({ error: "Invalid email." });
  }
}

const verifySignupInputs = (req, res, next) => {
  const { fullname, email } = { ...req.body };
  const errors = {};
  if (!isName(fullname)) {
    errors.name = "Invalid name.";
  }
  if (!isEmail(email)) {
    errors.email = "Invalid email.";
  }
  if (Object.keys(errors).length > 0) {
    res.json({ errors });
  }
  else {
    next();
  }
}

const verifySurveyInputs = (req, res, next) => {
  const { title, description, validityDate, validityTime } = { ...req.body };
  const errors = {};
  if (!isTitle(title)) {
    errors.title = "Invalid title format.";
  }
  else if (title.length < 5) {
    errors.title = "Title too short."
  }
  if (!isDescription(description)) {
    errors.description = "Invalid description format.";
  }
  else if (description.length < 100) {
    errors.description = "Description must be at least 100 characters long.";
  }
  else if (description.length > 200) {
    errors.description = "Description must be at most 200 characters long.";
  }
  if (!isDate(validityDate)) {
    errors.date = "Invalid date format.";
  }
  if (!isTime(validityTime)) {
    errors.time = "Invalid time format.";
  }
  if (Object.keys(errors).length > 0) {
    res.json({ errors });
  }
  else {
    next();
  }
}

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  }
  else {
    res.redirect('/');
  }
}

const verifyID = (req, res, next) => {
  const inputs = req.params;
  const keys = Object.keys(inputs).filter(key => /ID$/.test(key));
  const errors = {};
  keys.forEach(key => {
    if (!isObjectID(inputs[key])) {
      errors[key.slice(0, -2)] = `Invalid ${key.slice(0, -2)} ${key.slice(-2)}`;
    }
  });
  if (Object.keys(errors).length > 0) {
    res.json({ errors });
  }
  else {
    next();
  }
}

const verifyQuestionInputs = (req, res, next) => {
  const { question, type, options } = { ...req.body };
  const textbox = req.body.textbox ? true : false;
  const errors = {};
  if (!isQuestion(question)) {
    errors.question = "Invalid question format.";
  }
  if (!isValidOptionType(type)) {
    errors.type = "Invalid option type.";
  }
  if (Array.isArray(options)) {
    if (!options.every(option => isOption(option))) {
      errors.options = "Invalid option format.";
    }
  }
  else {
    if (!textbox) {
      errors.option = "Option of a question with only one option must be a textbox.";
    }
    else if (!isOption(options)) {
      errors.option = "Invalid option format.";
    }
  }
  if (Object.keys(errors).length > 0) {
    res.json({ errors });
  }
  else {
    next();
  }
}

const isPublishable = (req, res, next) => {
  const surveyID = req.params.surveyID;
  const userID = req.user._id;
  const state = req.params.state ? true : false;
  view(surveyID, userID, (error, survey) => {
    if (error) {
      res.json({ error: "An error occured while verification." });
    }
    else if (state === true && survey.questions.length === 0) {
      res.json({ error: "To publish a survey, add at least one question." });
    }
    else if (state === true && survey.published) {
      res.json({ message: "Survey already publihed." });
    }
    else {
      next();
    }
  });
}

const isPublished = (req, res) => {
  const surveyID = req.params.surveyID;
  const userID = req.user._id;
  view(surveyID, userID, (error, survey) => {
    if (error) {
      res.json({ error: "An error occured while verification." });
    }
    else {
      res.json({ state: survey.published });
    }
  });
}

const verifyEditInputs = (req, res, next) => {
  const { field, value } = { ...req.body };
  let error = {};
  switch (field) {
    case "title":
      if (!isTitle(value)) {
        error.title = "Invalid title format.";
      }
      break;
    case "description":
      if (!isDescription(value)) {
        error.title = "Invalid description format.";
      }
      break;
    case "validity":
      const { validityDate, validityTime } = { ...req.body };
      if (!isDate(validityDate)) {
        error.date = "Invalid date format.";
      }
      if (!isTime(validityTime)) {
        error.time = "Invalid time format.";
      }
      break;
    default:
      error = "Invalid option.";
  }
  if (Object.keys(error).length > 0) {
    res.json({ error });
  }
  else {
    next();
  }
}

module.exports = { verifyLoginInputs, verifySignupInputs, verifySurveyInputs, ensureAuthenticated, verifyID, verifyQuestionInputs, isPublishable, isPublished, verifyEditInputs };

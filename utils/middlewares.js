const { isName, isDate, isTime, isEmail, isTitle, isDescription } = require('./validator');

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

module.exports = { verifyLoginInputs, verifySignupInputs, verifySurveyInputs, ensureAuthenticated };

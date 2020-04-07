const { isEmail, isName } = require('./validator');

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

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  }
  else {
    res.redirect('/');
  }
}

module.exports = { verifyLoginInputs, verifySignupInputs, ensureAuthenticated };

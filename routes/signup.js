const express = require('express');
const router  = express.Router();
const SignUp  = require('../controllers/signup');

router.post('/', (req, res) => {
  const { fullname, email, password } = { ...req.body };
  SignUp(fullname, email, password, (error, result) => {
    if (error) {
      res.json({ error: error });
    }
    else {
      res.json({ result });
    }
  });
});

module.exports = router;

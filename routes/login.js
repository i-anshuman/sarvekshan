const express = require('express');
const router  = express.Router();
const Login   = require('../controllers/login');

router.post('/', (req, res) => {
  const { email, password } = { ...req.body };
  console.log(email + " : " + password);
  Login(email, password, (error, result) => {
    if (error) {
      res.json({ error : error });
    }
    else {
      res.json({ result });
    }
  });
});

module.exports = router;

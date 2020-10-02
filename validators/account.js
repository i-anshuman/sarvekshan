const { body } = require('express-validator');

const valiateSigninInputs = () => (
  [
    body('email', 'Provide a valid email.')
      .trim().isEmail().normalizeEmail(),
    body('password', 'Password must be at least 8 characters long.')
      .trim().isLength({ min: 8 })
  ]
);

const valiateSignupInputs = () => (
  [
    body('fullname', 'Fullname can only have alphabets and spaces.')
      .trim().matches(/^[A-Za-z]([ ]?[A-Za-z]+)+$/),
    ...valiateSigninInputs()
  ]
);

module.exports = { valiateSigninInputs, valiateSignupInputs };

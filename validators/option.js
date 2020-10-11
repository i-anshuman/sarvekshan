'use strict';

const { body } = require('express-validator');

const validateOptionInputs = () => (
  [
    body('option', `Option can only have alphabets, digits, brackets and some special symbols (. : , ' - ?).`)
      .trim().matches(/^[A-Za-z0-9 .:\(\)\[\]\{\}?',-]+$/),
    body('textbox', `Value of textbox can either be 'true' or 'false'.`)
      .optional().isIn(['true', 'false']).toBoolean()
  ]
);

module.exports = { validateOptionInputs };

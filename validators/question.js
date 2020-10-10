'use strict';

const { body } = require('express-validator');

const validateQuestionInputs = () => (
  [
    body('question', `Question can only have alphabets, digits, brackets and some special symbols (. : , ' - ?).`)
      .trim().matches(/^[A-Za-z0-9 .:\(\)\[\]\{\}?',-]+$/),
    body('type', `Option type can be either 'checkbox' or 'radio'.`)
      .trim().isIn(['checkbox', 'radio']),
    body('textbox', `Value of textbox can either be 'true' or 'false'.`)
      .optional().isIn(['true', 'false']).toBoolean(),
    body('options', `Options must be an array.`)
      .isArray().custom((value, {req}) => {
        if (value.length === 1) {
          if (req.body.textbox) {
            return true;
          }
          return false;
        }
        return true;
      }).withMessage(`Question with one option only must have textbox set to 'true'.`),
    body('options.*', `Options can only have alphabets, digits, brackets and some special symbols (. : , ' - ?).`)
      .trim().matches(/^[A-Za-z0-9 .:\(\)\[\]\{\}?',-]+$/)
  ]
);

const validateQuestionEditInputs = () => (
  [
    body('question', `Question can only have alphabets, digits, brackets and some special symbols (. : , ' - ?).`)
      .optional().trim().matches(/^[A-Za-z0-9 .:\(\)\[\]\{\}?',-]+$/),
    body('type', `Option type can be either 'checkbox' or 'radio'.`)
      .optional().trim().isIn(['checkbox', 'radio'])
  ]
);

module.exports = { validateQuestionInputs, validateQuestionEditInputs };

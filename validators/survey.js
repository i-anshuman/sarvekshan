'use strict';

const { body, param } = require('express-validator');
const { capitalize } = require('../utils');

const valiateSurveyInputs = () => (
  [
    body('title', `Title must be at least 5 characters long and can only contains alphabets, digits, and some special symbols (. : , ' - ).`)
      .trim().matches(/^[A-Za-z0-9 .:',-]+$/).isLength({min: 5}),
    body('description', `Description must be 100-200 characters long and can only contains alphabets, digits, and some special symbols (. : , ' - ).`)
      .trim().matches(/^[A-Za-z0-9 .:',-]+$/).isLength({min: 100, max: 200}),
    body('validityDate', 'Must provide a valid date in YYYY-MM-DD format.')
      .trim().isDate(),
    body('validityTime', 'Must provide a valid time in HH:MM format')
      .trim().matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
  ]
);

const validateIDs = (...parameters) => {
  return parameters.map(parameter => (
    param(parameter, `${capitalize(parameter)} must be valid.`)
      .isMongoId()
  ));
};

const validatePublishStatus = () => (
  [
    param('state', 'Survey publish state must be boolean (true or false).')
      .isBoolean()
  ]
);

const validateSurveyEditInputs = () => (
  [
    body('title', `Title must be at least 5 characters long and can only contains alphabets, digits, and some special symbols (. : , ' - ).`)
      .optional().trim().matches(/^[A-Za-z0-9 .:',-]+$/).isLength({min: 5}),
    body('description', `Description must be 100-200 characters long and can only contains alphabets, digits, and some special symbols (. : , ' - ).`)
      .optional().trim().matches(/^[A-Za-z0-9 .:',-]+$/).isLength({min: 100, max: 200}),
    body('validityDate', 'Must provide a valid date in YYYY-MM-DD format.')
      .optional().trim().isDate(),
    body('validityTime', 'Must provide a valid time in HH:MM format')
      .optional().trim().matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
  ]
);

module.exports = {
  validateIDs,
  valiateSurveyInputs,
  validatePublishStatus,
  validateSurveyEditInputs
};

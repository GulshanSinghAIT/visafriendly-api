const { body } = require('express-validator');

exports.validateEducation = [
  body('educations').isArray().withMessage('Educations must be an array'),
  body('educations.*.school')
    .notEmpty().withMessage('School name is required')
    .isString().withMessage('School name must be a string'),
  body('educations.*.major')
    .notEmpty().withMessage('Major is required')
    .isString().withMessage('Major must be a string'),
  body('educations.*.degree')
    .notEmpty().withMessage('Degree is required')
    .isString().withMessage('Degree must be a string'),
  body('educations.*.gpa')
    .optional()
    .isFloat({ min: 0, max: 4.0 }).withMessage('GPA must be between 0 and 4.0'),
  body('educations.*.startMonth')
    .notEmpty().withMessage('Start month is required')
    .isString().withMessage('Start month must be a string'),
  body('educations.*.startYear')
    .notEmpty().withMessage('Start year is required')
    .isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('Invalid start year'),
  body('educations.*.endMonth')
    .notEmpty().withMessage('End month is required')
    .isString().withMessage('End month must be a string'),
  body('educations.*.endYear')
    .notEmpty().withMessage('End year is required')
    .isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('Invalid end year')
    .custom((value, { req, path }) => {
      const index = parseInt(path.split('.')[1]);
      const startYear = req.body.educations[index].startYear;
      if (value < startYear) {
        throw new Error('End year must be greater than or equal to start year');
      }
      return true;
    })
]; 
const {check} = require('express-validator');

// SIGNUP
exports.tagCreateValidator=[
    check('name')
        .not()
        .isEmpty()
        .withMessage('Name is required.'),
];

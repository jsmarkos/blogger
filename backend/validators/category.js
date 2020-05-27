const {check} = require('express-validator');

// SIGNUP
exports.categoryCreateValidator=[
    check('name')
        .not()
        .isEmpty()
        .withMessage('Name is required.'),
];

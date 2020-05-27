const {check} = require('express-validator');

// SIGNUP
exports.userSignUpValidator=[
    check('name')
        .not()
        .isEmpty()
        .withMessage('Name is required.'),

    check('email')
        .isEmail()
        .withMessage('Must be a valid email adress'),
    check('password')
        .isLength({min:6})
        .withMessage('Password must be a least 6 characters long')
];

// SIGNIN


exports.userSignInValidator=[

    check('email')
        .isEmail()
        .withMessage('Must be a valid email adress'),
    check('password')
        .isLength({min:6})
        .withMessage('Password must be a least 6 characters long')
];
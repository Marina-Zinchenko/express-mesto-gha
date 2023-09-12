const router = require('express').Router();
const signupRouter = require('./signup');
const signinRouter = require('./signin');

router.use('./signup', signupRouter);
router.use('./signin', signinRouter);

module.exports = router;

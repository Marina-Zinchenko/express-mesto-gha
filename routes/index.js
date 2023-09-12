const router = require('express').Router();
const auth = require('../middlewares/auth');

const signupRouter = require('./signup');
const signinRouter = require('./signin');

router.use('./signup', signupRouter);
router.use('./signin', signinRouter);

router.use(auth);
router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

module.exports = router;

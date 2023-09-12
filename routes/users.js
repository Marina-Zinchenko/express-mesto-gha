const router = require('express').Router();
const {
  getUsers, getUserMe, getUserById, editUserProfile, editUserAvatar,
} = require('../controllers/users');
const { validateUserId, validateUserProfile, validateUserAvatar } = require('../middlewares/validationError');

router.get('/', getUsers);
router.get('/me', getUserMe);
router.get('/:userId', validateUserId, getUserById);
router.patch('/me', validateUserProfile, editUserProfile);
router.patch('/me/avatar', validateUserAvatar, editUserAvatar);

module.exports = router;

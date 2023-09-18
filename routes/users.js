const router = require('express').Router();
const {
  getUsers, getUserById, editUserData, editUserAvatar, getMeUser,
} = require('../controllers/users');
const {
  validateUserId,
  validateUserUpdate,
  validateUserAvatar,
} = require('../middlewares/celebrateErrors');

router.get('/', getUsers);
router.get('/me', getMeUser);

router.get('/:userId', validateUserId, getUserById);
router.patch('/me', validateUserUpdate, editUserData);
router.patch('/me/avatar', validateUserAvatar, editUserAvatar);

module.exports = router;

const router = require('express').Router();
const { validateUserId, validateUserProfile, validateUserAvatar } = require('../middlewares/validationError');
const {
  getUsers, getUserMe, getUserById, editUserProfile, editUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserMe);
router.get('/:id', validateUserId, getUserById);
router.patch('/me', validateUserProfile, editUserProfile);
router.patch('/me/avatar', validateUserAvatar, editUserAvatar);

module.exports = router;

const router = require('express').Router();
const {
  getCards, addCard, deleteCard, addLikeCard, deleteLikeCard,
} = require('../controllers/cards');
const {
  validateCardPost,
  validateCardId,
} = require('../middlewares/celebrateErrors');

router.get('/', getCards);
router.post('/', validateCardPost, addCard);
router.delete('/:cardId', validateCardId, deleteCard);
router.put('/:cardId/likes', validateCardId, addLikeCard);
router.delete('/:cardId/likes', validateCardId, deleteLikeCard);

module.exports = router;

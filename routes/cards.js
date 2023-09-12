const router = require('express').Router();
const {
  getCards, addCard, deleteCard, addLikeCard, deleteLikeCard,
} = require('../controllers/cards');
const { validateAddCard, validateCardId } = require('../middlewares/validationError');

router.get('/', getCards);
router.post('/', validateAddCard, addCard);
router.delete('/:cardId', validateCardId, deleteCard);
router.put('/:cardId/likes', validateCardId, addLikeCard);
router.delete('/:cardId/likes', validateCardId, deleteLikeCard);

module.exports = router;

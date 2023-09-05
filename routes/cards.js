const router = require('express').Router();
const {
  getCards, addCard, deleteCard, addLikeCard, deleteLikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', addCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', addLikeCard);
router.delete('/:cardId/likes', deleteLikeCard);

module.exports = router;

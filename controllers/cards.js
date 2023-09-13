const { NotFoundError } = require('../errors/NotFoundError');
const { BadRequest } = require('../errors/BadRequest');
const { ForbiddenError } = require('../errors/ForbiddenError');

const Card = require('../models/card');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.addCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Некорректные данные для добавления карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => new NotFoundError('Карточка не найдена.'))
    .then((card) => {
      if (JSON.stringify(card.owner) !== JSON.stringify(req.user.payload)) {
        return next(new ForbiddenError('Невозможно удалить чужую карточку.'));
      }
      return card.remove()
        .then(() => res.send({ message: 'Карточка удалена.' }));
    })
    .catch(next);
};

module.exports.addLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user.payload } },
    { new: true },
  )
    .orFail(() => new NotFoundError('Карточка не найдена.'))
    .then((card) => res.send(card))
    .catch(next);
};

module.exports.deleteLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user.payload } },
    { new: true },
  )
    .orFail(() => new NotFoundError('Карточка не найдена.'))
    .then((card) => res.status(200).send(card))
    .catch(next);
};

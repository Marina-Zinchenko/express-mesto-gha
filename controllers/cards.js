const { NotFoundError } = require('../errors/NotFoundError');
const { BadRequest } = require('../errors/BadRequest');
const { ForbiddenError } = require('../errors/ForbiddenError');

const Card = require('../models/card');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch((err) => {
      next(err);
    });
};

module.exports.addCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Некорректные данные для добавления карточки'));
      }
      return next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка не найдена'));
      }

      if (card.owner.toString() !== req.user._id) {
        return next(new ForbiddenError('Удаление чужой карточки'));
      }

      return Card.findByIdAndRemove(cardId)
        .populate(['owner', 'likes'])
        .then((myCard) => {
          res.send({ data: myCard });
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw next(new BadRequest('Некорректный ID карточки'));
      }
      throw next(err);
    });
};

module.exports.addLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: 'true' })
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BadRequest).send({ message: 'Некорректный ID карточки' });
        return next(new BadRequest('Некорректный ID карточки'));
      }
      return next(err);
    });
};

module.exports.deleteLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: 'true' })
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BadRequest).send({ message: 'Некорректный ID карточки' });
        return next(new BadRequest('Некорректный ID карточки'));
      }
      return next(err);
    });
};

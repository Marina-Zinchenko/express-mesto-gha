const bcrypt = require('bcryptjs');
const NotFoundError = require('../errors/NotFoundError');
const BadRequest = require('../errors/BadRequest');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const User = require('../models/user');

const getToken = require('../utils/getToken');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (!users) {
        throw new NotFoundError('Пользователи не найдены.');
      }
      res.status(200).send(users);
    })
    .catch(next);
};

module.exports.getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest('Некорректный ID пользователя'));
      }
      return next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        email,
        password: hash,
        name,
        about,
        avatar,
      })
        .then((user) => res.status(201).send({
          email: user.email,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
        }))
        .catch((error) => {
          if (error.name === 'MongoServerError' || error.code === 11000) {
            next(new ConflictError('Пользователь с такой почтой уже зарегистрирован.'));
          } else if (error.name === 'ValidationError') {
            next(new BadRequest('Переданы неккоректные данные для создания пользователя.'));
          } else {
            next(error);
          }
        });
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Некорректный ID пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports.editUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: 'true', runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.editUserAvatar = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, { new: 'true', runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      const token = getToken(user._id);
      res
        .cookie('jwt', token, {
          maxage: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .send({ message: 'Успешная авторизация.' });
    })
    .catch(() => {
      next(new UnauthorizedError('Неправильные почта или пароль.'));
    });
};

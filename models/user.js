const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
    unique: true,
    validate: {
      validator: (email) => {
        validator.isEmail(email);
      },
      message: 'Введите email',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (url) => {
        validator.isURL(url);
      },
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      message: 'Неверно указан URL',
    },
  },
});

module.exports = mongoose.model('user', userSchema);

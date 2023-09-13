const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    require: [true, 'Поле должно быть заполнено'],
    unique: true,
    validate: {
      validator: (email) => {
        validator.isEmail(email);
      },
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    select: false,
  },
  name: {
    type: String,
    minlength: [2, 'Минимальное количество символов - 2'],
    maxlength: [30, 'Максимальное количество символов - 30'],
    default: 'Жак Ив Кусто',
  },
  about: {
    type: String,
    minlength: [2, 'Минимальное количество символов - 2'],
    maxlength: [30, 'Максимальное количество символов - 30'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: true,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (url) => {
        validator.isURL(url);
      },
      message: 'Неверно указан URL',
    },
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);

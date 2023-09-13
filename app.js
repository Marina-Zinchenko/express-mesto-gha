require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const { validateLogin, validateCreateUser } = require('./middlewares/validationError');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/NotFoundError');
const validationErrorServer = require('./middlewares/validationErrorServer');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(helmet());
app.use(limiter);
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
});

app.use('/signup', validateCreateUser, createUser);
app.use('/signin', validateLogin, login);

app.use(auth);
app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);

app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errors());

app.use(validationErrorServer);

app.listen(PORT);

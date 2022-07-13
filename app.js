const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const { celebrate, Joi, errors } = require('celebrate');
const bodyParser = require('body-parser');
require('dotenv').config();
const userRouter = require('./routes/users');
const gameRouter = require('./routes/games');
// const auth = require('./middlewares/auth');
const { validateURL } = require('./utils/validators');
const AppError = require('./errors/AppError');

const {
  login, createUser,
} = require('./controllers/users');

const { requestLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

const app = express();
app.use(helmet());
mongoose.connect('mongodb://localhost:27017/evilplays');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());
app.options('*', cors());

app.use(requestLogger);

app.get('/', (req, res, next) => {
  const error = new AppError(404, 'Requested resource not found');
  next(error);
});

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateURL),
  }),
}), createUser);

// app.use(auth);

app.use('/', userRouter);
app.use('/', gameRouter);

app.use(errors());
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      // check the status and display a message based on it
      message: statusCode === 500
        ? 'An error occurred on the server'
        : message,
    });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});

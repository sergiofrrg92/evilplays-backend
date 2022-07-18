const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const { celebrate, Joi, errors } = require('celebrate');
const bodyParser = require('body-parser');
require('dotenv').config();
const centralisedErrorHandling = require('./utils/centralisedErrorHandling');
const indexRouter = require('./routes/index');
const auth = require('./middlewares/auth');
const AppError = require('./errors/AppError');

const { NODE_ENV, MONGO_URL } = process.env;

const {
  login, createUser,
} = require('./controllers/users');

const { requestLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

const app = express();
app.use(helmet());
mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : 'mongodb://localhost:27017/evilplays');

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

app.use('/', indexRouter);

app.use(errors());
app.use(centralisedErrorHandling);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});

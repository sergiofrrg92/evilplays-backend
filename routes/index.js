const index = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const userRouter = require('./users');
const gameRouter = require('./games');

const auth = require('../middlewares/auth');

const {
  login, createUser,
} = require('../controllers/users');

index.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
}), login);
index.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    games: Joi.array().items(Joi.string().hex().length(24)),
  }),
}), createUser);

index.use(auth);

index.use('/', userRouter);
index.use('/', gameRouter);

module.exports = index;

const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers, getUser, getCurrentUser, updateProfile,
} = require('../controllers/users');

userRouter.get('/users/', getUsers);
userRouter.get('/users/me', getCurrentUser);
userRouter.get('/users/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
}), getUser);
userRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    games: Joi.array().items(Joi.string().hex().length(24)),
  }),
}), updateProfile);

module.exports = userRouter;

const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { validateURL } = require('../utils/validators');

const {
  getUsers, getUser, getCurrentUser, updateProfile, updateAvatar,
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
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateURL),
  }),
}), updateProfile);
userRouter.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom(validateURL),
  }),
}), updateAvatar);

module.exports = userRouter;

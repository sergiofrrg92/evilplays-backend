const gameRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const {
  getGames, createGame, deleteGame,
} = require('../controllers/games');

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
};

gameRouter.get('/games/', getGames);
gameRouter.post('/games/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    link: Joi.string().required().custom(validateURL),
  }),
}), createGame);
gameRouter.delete('/games/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
}), deleteGame);

module.exports = gameRouter;

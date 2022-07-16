const Game = require('../models/game');
const AppError = require('../errors/AppError');

// the get game request handler
module.exports.getGames = (req, res) => {
  Game.find()
    .then((games) => res.send({ data: games }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

// the createGame request handler
module.exports.createGame = (req, res, next) => {
  const {
    name, image, description, rating, hoursPlayed, released,
  } = req.body;

  Game.create({
    name, image, description, rating, hoursPlayed, released,
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      let error = new AppError(500, 'Internal Server Error');
      if (err.name === 'ValidationError') {
        error = new AppError(400, err.message);
      }
      next(error);
    });
};

// the createUser request handler
module.exports.deleteGame = (req, res, next) => {
  Game.deleteOne({ _id: req.params.id })
    .then((game) => res.send({ data: game }))
    .catch((err) => {
      let error = new AppError(500, 'Internal Server Error');
      if (err.name === 'CastError') {
        error = new AppError(400, 'Error retrieving game');
      } else if (err.name === 'DocumentNotFoundError') {
        error = new AppError(404, 'Game not found');
      } else if (err.message === 'You are not authorized to do that') {
        error = new AppError(403, 'You are not authorized to do that');
      }
      next(error);
    });
};

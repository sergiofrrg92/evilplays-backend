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
  const { name, link } = req.body;
  const owner = req.user;

  Game.create({ name, link, owner })
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
  Game.checkIsOwner(req)
    .then((game) => Game.deleteOne({ _id: game._id }))
    .then((game) => res.send({ data: game, user: req.user }))
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

module.exports.likeGame = (req, res, next) => {
  Game.findByIdAndUpdate(
    req.params.gameId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true },
  )
    .orFail()
    .then((game) => res.send({ data: game }))
    .catch((err) => {
      let error = new AppError(500, 'Internal Server Error');
      if (err.name === 'CastError') {
        error = new AppError(400, 'Error retrieving game');
      } else if (err.name === 'DocumentNotFoundError') {
        error = new AppError(404, 'Game not found');
      }
      next(error);
    });
};

module.exports.dislikeGame = (req, res, next) => {
  Game.findByIdAndUpdate(
    req.params.gameId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true },
  )
    .orFail()
    .then((game) => res.send({ data: game }))
    .catch((err) => {
      let error = new AppError(500, 'Internal Server Error');
      if (err.name === 'CastError') {
        error = new AppError(400, 'Error retrieving game');
      } else if (err.name === 'DocumentNotFoundError') {
        error = new AppError(404, 'Game not found');
      }
      next(error);
    });
};

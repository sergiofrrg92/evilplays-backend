const bcrypt = require('bcryptjs');// importing bcrypt
const jwt = require('jsonwebtoken');
const AppError = require('../errors/AppError');

const { NODE_ENV, JWT_SECRET } = process.env;
const User = require('../models/user');

const { ERROR_400_USER, ERROR_404_USER, ERROR_500 } = require('../utils/errorConstants');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch((err) => {
      const error = new AppError(401, err.message);
      next(error);
    });
};

// the getUsers request handler
module.exports.getUsers = (req, res, next) => {
  User.find()
    .then((users) => res.send({ user: req.user, data: users }))
    .catch((err) => {
      const error = new AppError(500, err.message);
      next(error);
    });
};

// the getUser request handler
module.exports.getUser = (req, res, next) => {
  User.findById(req.params.id)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      let error = new AppError(500, ERROR_500);
      if (err.name === 'CastError') {
        error = new AppError(400, ERROR_400_USER);
      } else if (err.name === 'DocumentNotFoundError') {
        error = new AppError(404, ERROR_404_USER);
      }
      next(error);
    });
};

// the getCurrentUser request handler
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      let error = new AppError(500, 'Internal Server Error');
      if (err.name === 'CastError') {
        error = new AppError(400, ERROR_400_USER);
      } else if (err.name === 'DocumentNotFoundError') {
        error = new AppError(404, ERROR_404_USER);
      }
      next(error);
    });
};

// the createUser request handler
module.exports.createUser = (req, res, next) => {
  const {
    name, email, password, games,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash, games,
    }))
    .then(() => res.send({ data: { name, email } }))
    .catch((err) => {
      let error = new AppError(500, 'Internal Server Error');
      if (err.name === 'ValidationError') {
        error = new AppError(400, err.message);
      } else if (err.name === 'MongoServerError') {
        error = new AppError(409, err.message);
      }
      next(error);
    });
};

// the update profile request handler
module.exports.updateProfile = (req, res, next) => {
  const { name, games } = req.body;
  const opts = { runValidators: true, new: true };

  User.findOneAndUpdate({ _id: req.user._id }, { name, games }, opts)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      let error = new AppError(500, ERROR_500);
      if (err.name === 'ValidationError') {
        error = new AppError(400, err.message);
      } else if (err.name === 'CastError') {
        error = new AppError(400, ERROR_400_USER);
      } else if (err.name === 'DocumentNotFoundError') {
        error = new AppError(404, ERROR_404_USER);
      }
      next(error);
    });
};

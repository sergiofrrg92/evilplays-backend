const jwt = require('jsonwebtoken');
const AppError = require('../errors/AppError');
const { ERROR_401 } = require('../utils/errorConstants');

const { NODE_ENV, JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    const error = new AppError(401, ERROR_401);
    next(error);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    const error = new AppError(401, ERROR_401);
    next(error);
  }

  req.user = payload;

  next();
};

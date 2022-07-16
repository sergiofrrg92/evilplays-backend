const jwt = require('jsonwebtoken');
const AppError = require('../errors/AppError');

const { NODE_ENV, JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    const error = new AppError(401, 'Authorization Required');
    next(error);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    const error = new AppError(401, 'Authorization Required');
    next(error);
  }

  req.user = payload;

  next();
};

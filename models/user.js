const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
// Describe the schema:
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Jacques Cousteau',
  },
  about: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Explorer',
  },
  avatar: {
    type: String,
    required: false,
    validate: {
      validator(v) {
        return /[(http(s)?)://(www.)?a-zA-Z0-9@:%.!$_+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/.test(v);
      },
      message: (props) => `${props.value} is not a valid link`,
    },
    default: 'https://pictures.s3.yandex.net/resources/avatar_1604080799.jpg',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: (props) => `${props.value} is not a valid email`,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Incorrect email or password'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Incorrect email or password'));
          }

          return user;// now user is available
        });
    });
};

// create the model and export it
module.exports = mongoose.model('user', userSchema);

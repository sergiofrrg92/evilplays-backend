const mongoose = require('mongoose');
// Describe the schema:
const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /[(http(s)?)://(www.)?a-zA-Z0-9@:%.!$_+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/.test(v);
      },
      message: (props) => `${props.value} is not a valid link`,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

gameSchema.statics.checkIsOwner = function checkIsOwner(req) {
  return this.findOne({ _id: req.params.id })
    .then((game) => {
      if (!game) {
        return Promise.reject(new Error('Game couldnt be retrieved'));
      }

      if (req.user._id.toString() !== game.owner.toString()) {
        return Promise.reject(new Error('You are not authorized to do that'));
      }

      return game;
    });
};

// create the model and export it
module.exports = mongoose.model('game', gameSchema);

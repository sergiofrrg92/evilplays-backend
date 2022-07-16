const mongoose = require('mongoose');
// Describe the schema:
const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /[(http(s)?)://(www.)?a-zA-Z0-9@:%.!$_+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/.test(v);
      },
      message: (props) => `${props.value} is not a valid link`,
    },
  },
  description: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 300,
  },
  rating: {
    type: Number,
    required: true,
  },
  hoursPlayed: {
    type: Number,
    required: true,
    default: 0,
  },
  released: {
    type: Date,
    default: Date.now,
  },
});

// create the model and export it
module.exports = mongoose.model('game', gameSchema);

const mongoose = require('mongoose');
const {Schema} = mongoose;

const recentSchema = new Schema({
  query: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
});

const Recent = mongoose.model('recent', recentSchema);
module.exports = Recent;

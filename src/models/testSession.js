const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TestSessionSchema = new Schema({
  paper: { type: Schema.Types.ObjectId, ref: 'Paper' },
  startAt: Date,
  finishedAt: Date,
  timeLimitMinutes: { type: Number, default: 180 },
  timedOut: { type: Boolean, default: false },
  score: Number,
  attempted: Number,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 11400
  }
});

module.exports = mongoose.model('Session', TestSessionSchema);

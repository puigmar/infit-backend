const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const programmSchema = new Schema({
  sessionsID: [ { type: Schema.Types.ObjectId, ref: "Session" }],
  scheduleID: { type: Schema.Types.ObjectId, ref: "Schedule" },
  clientID: { type: Schema.Types.ObjectId, ref: "User" },
  coachID: { type: Schema.Types.ObjectId, ref: "Coach" },
  objective: String,
  pack: {
    name: String,
    duration: Number,
    price: Number,
    weekSessions: Number
  },
  isActive: {
    type: Boolean,
    default: false
  },
  initialDay: String,
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
});

const Programm = mongoose.model('Programm', programmSchema);

module.exports = Programm;
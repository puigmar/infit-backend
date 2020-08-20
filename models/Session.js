const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
  date: Date,
  clientID: { type: Schema.Types.ObjectId, ref: "User" },
  coachID: { type: Schema.Types.ObjectId, ref: "Coach" },
  programID: { type: Schema.Types.ObjectId, ref: "Program" },
  scheduleID: { type: Schema.Types.ObjectId, ref: "Schedule" },
  sessionsID: [ { type: Schema.Types.ObjectId, ref: "Session" }],
  blockID: [ { type: Schema.Types.ObjectId, ref: "Block" }],
  title: String,
  notes: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
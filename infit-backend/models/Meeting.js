const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const meetingSchema = new Schema({
  scheduleID: { type: Schema.Types.ObjectId, ref: "Schedule" },
  clientID: { type: Schema.Types.ObjectId, ref: "User" },
  coachID: { type: Schema.Types.ObjectId, ref: "Coach" },
  roomID: String,
  date: Date,
  url: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
});

const Meeting = mongoose.model('Meeting', meetingSchema);

module.exports = Meeting;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const meetingSchema = new Schema({
  //scheduleDayID: { type: Schema.Types.ObjectId, ref: "ScheduleDay" },
  clientID: { type: Schema.Types.ObjectId, ref: "User" },
  coachID: { type: Schema.Types.ObjectId, ref: "Coach", default: null },
  programID: { type: Schema.Types.ObjectId, ref: "Program" },
  roomID: String,
  date: Date,
  url: String,
  finished: {
    type: Boolean,
    default: false
  } 
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
});

const Meeting = mongoose.model('Meeting', meetingSchema);

module.exports = Meeting;

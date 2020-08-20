const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scheduleSchema = new Schema({
  date: String,
  availability: [{
    min: Number,
    max: Number
  }],
  sessionsID: [ { type: Schema.Types.ObjectId, ref: "Session" }],
  meetingID: { type: Schema.Types.ObjectId, ref: "Meeting" }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;
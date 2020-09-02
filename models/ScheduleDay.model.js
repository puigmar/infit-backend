const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scheduleDaySchema = new Schema(
  {
    coachID: { type: Schema.Types.ObjectId, ref: 'Coach' },
    sessionsID: [{ type: Schema.Types.ObjectId, ref: 'Session' }],
    meetingID: [{ type: Schema.Types.ObjectId, ref: 'Meeting' }],
    date: Date.now(),
    availability: [
      {
        min: Number,
        max: Number
      },
    ],
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

const ScheduleDay = mongoose.model('ScheduleDay', scheduleSchema);

module.exports = Schedule;

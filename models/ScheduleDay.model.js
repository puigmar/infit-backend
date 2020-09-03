const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scheduleDaySchema = new Schema(
  {
    coachID: { type: Schema.Types.ObjectId, ref: 'Coach' },
    trainingID: [{ type: Schema.Types.ObjectId, ref: 'Training' }],
    meetingID: [{ type: Schema.Types.ObjectId, ref: 'Meeting' }],
    date: Date, // 2013-02-08
    occupedAt: [Number],
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

const ScheduleDay = mongoose.model('ScheduleDay', scheduleDaySchema);

module.exports = ScheduleDay;

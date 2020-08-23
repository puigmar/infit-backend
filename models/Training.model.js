const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const trainingSchema = new Schema({
  date: {type: Date, default: Date.now()},
  clientID: { type: Schema.Types.ObjectId, ref: "User" },
  coachID: { type: Schema.Types.ObjectId, ref: "Coach" },
  programID: { type: Schema.Types.ObjectId, ref: "Program" },
  scheduleID: { type: Schema.Types.ObjectId, ref: "Schedule" },
  blockID: [ { type: Schema.Types.ObjectId, ref: "Block" }],
  title: String,
  notes: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
});

const Training = mongoose.model('Training', trainingSchema);

module.exports = Training;
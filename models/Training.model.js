const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const trainingSchema = new Schema(
  {
    date: String, // 2013-02-08 09:30
    clientID: { type: Schema.Types.ObjectId, ref: 'User' },
    coachID: { type: Schema.Types.ObjectId, ref: 'User' },
    programID: { type: Schema.Types.ObjectId, ref: 'Program' },
    exercises: [{ type: Schema.Types.ObjectId, ref: 'Exercise'}],
    title: String,
    note: String,
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

const Training = mongoose.model('Training', trainingSchema);

module.exports = Training;

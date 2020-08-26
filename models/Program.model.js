const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const programSchema = new Schema({
  trainingID: [ { type: Schema.Types.ObjectId, ref: "Training" }],
  clientID: { type: Schema.Types.ObjectId, ref: "Client" },
  coachID: { type: Schema.Types.ObjectId, ref: "Coach" },
  picture: String,
  objective: String,
  pack: {
    name: String,
    duration: Number,
    price: Number,
    weekSessions: Number
  },
  initialDay: Date
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
});

const Program = mongoose.model('Programm', programSchema);

module.exports = Program;
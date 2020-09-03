const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const programSchema = new Schema({
  trainingIDs: [ { type: Schema.Types.ObjectId, ref: "Training" }],
  clientID: { type: Schema.Types.ObjectId, ref: "Client" },
  coachID: { type: Schema.Types.ObjectId, ref: "Coach" },
  picture: String,
  objective: String,
  pack: {
    name: String,
    duration: Number,
    price: Number
  },
  initialDay: {
    type: Date,
    default: Date.now
  },
  timeTables: [{
    weekDay: Number,
    hour: Number
  }]
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
});

const Program = mongoose.model('Programm', programSchema);

module.exports = Program;
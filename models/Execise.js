const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
  blockID: { type: Schema.Types.ObjectId, ref: "Block" },
  image: String,
  video: String,
  title: String,
  description: String,
  rest: {
    minute: Number,
    second: Number
  },
  repetitions: Number,
  sets: Number
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise;
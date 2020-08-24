const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blockSchema = new Schema({

  trainingID: [{ type: Schema.Types.ObjectId, ref: "Training" }],
  exercises: [{ type: Schema.Types.ObjectId, ref: "Exercise" }],
  title: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
});

const Block = mongoose.model('Block', blockSchema);

module.exports = Block;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const coachSchema = new Schema(
  {
    userID: { type: Schema.Types.ObjectId, ref: 'User' },
    avatarUrl: String,
    name: String,
    surname: String,
    dni: String,
    telephone: Number,
    sex: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    address: String,
    avatarUrl: String,
    bankAccount: String,
    profileDescription: String,
    certificates: [
      {
        name: String,
        certificateNumber: String,
      },
    ],
    availability: {
      min: Number,
      max: Number,
    },
    yearsExperience: Number,
    experience: String,
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

const Coach = mongoose.model('Coach', coachSchema);

module.exports = Coach;

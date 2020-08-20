const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema(
  {
    clientID: { type: Schema.Types.ObjectId, ref: 'User' },
    savePhoto: {
      type: Boolean,
      default: false,
    },
    //sessions: [ { type: Schema.Types.ObjectId, ref: "Session" }],
    name: String,
    surname: String,
    card: String,
    telephone: Number,
    biometrics: {
      age: Number,
      height: Number,
      weight: [Number],
      sex: {
        type: String,
        enum: ['male', 'female', 'other'],
      },
    },
    wizard: {
      sportFrecuency: String,
      objective: String,
      trainningDays: [String],
      availability: {
        min: Number,
        max: Number,
      },
      pack: {
        name: String,
        duration: Number,
        price: Number,
      },
    },
    sexPreference: {
      type: String,
      enum: ['male', 'female'],
    },
    adress: String,
    photos: [
      {
        title: String,
        url: String,
        date: Date.now(),
      },
    ],
    avatarUrl: String,
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;

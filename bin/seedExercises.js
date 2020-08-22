require('dotenv').config();

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Exercise = require('../models/Execise');

const dbName = 'inFit';
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const exercises = [
  {
    coachID: { type: Schema.Types.ObjectId, ref: 'Coach' },
    image: String,
    video: String,
    title: String,
    description: String,
    rest: {
      minute: Number,
      second: Number,
    },
    repetitions: Number,
    sets: Number,
  }
];

Exercise.create(exercises, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Created ${exercises.length} trainings`);
  mongoose.connection.close();
});

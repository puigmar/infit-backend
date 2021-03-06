const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const coachSchema = new Schema({
  coachID: { type: Schema.Types.ObjectId, ref: "User" },
  sessions: [ { type: Schema.Types.ObjectId, ref: "Session" }],
  clients: [ { type: Schema.Types.ObjectId, ref: "Client" } ],
  avatarUrl: String,
  name: String,
  surname: String,
  dni: String,
  telephone: Number,
  sex: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  adress: String,
  avatarUrl: String,
  banckAccount: String,
  profileDescription: String,
  certificates: [{
    name: String,
    certificateNumber: String
  }],
  yearsExperience: Number,
  experience: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
});

const Coach = mongoose.model('Coach', coachSchema);

module.exports = Client;
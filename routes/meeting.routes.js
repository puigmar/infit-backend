const express = require('express');
const router = express.Router();
const Meeting = require('../models/Meeting.model');

//CREATE
router.post('/newMeeting', async (req, res, next) => {
  console.log(req.body)
  try {
    const newMeeting = await Meeting.create({ ...req.body });
    res.status(200).json(newMeeting);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// DELETE
router.post('/delete/:id', async (req, res, next) => {
  try {
    await Program.findByIdAndRemove({ _id: req.params.id });
  } catch (error) {
    console.log(error), next(error);
  }
});

//CALLS
//get next meeting by clientID
router.post('/next', async (req, res, next) => {
  try {
    const { clientID, programID } = req.body;
    console.log(req.body)
    const meeting = await Meeting.find({ clientID , programID, finished: { $ne: true}})
    console.log('meeting ------------------->', meeting)
    res.status(200).json(meeting);
  } catch (error) {}
});

module.exports = router;

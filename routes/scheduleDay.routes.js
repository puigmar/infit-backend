const express = require('express');
const router = express.Router();
const Training = require('../models/Training.model');
const Coach = require('../models/Coach.model');
const Meeting = require('../models/Meeting.model');
const Schedule = require('../models/ScheduleDay.model');

//CREATE
router.post('/newScheduleDay', async (req, res, next) => {
  try {

    const newSchedule = await Schedule.create({ ...req.body });

    if (Schedule) {


    }

    res.status(200).json(newTraining);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;

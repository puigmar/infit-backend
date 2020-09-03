const express = require('express');
const moment = require('moment');
const router = express.Router();
const Training = require('../models/Training.model');
const Coach = require('../models/Coach.model');
const Client = require('../models/Client.model');
const Program = require('../models/Program.model');
const ScheduleDay = require('../models/ScheduleDay.model')

const uploadCloud = require('../configs/cloudinary-setup');

//CREATE
router.post('/newTraining', async (req, res, next) => {
  try {
    const newTraining = await Training.create({ ...req.body });
    console.log('req.body ------->', req.body);

    if (newTraining) {

      // add to scheduleDay
      const trainingDate = moment(req.body.date);
      const trainingHour = trainingDate.format('H');
      const trainingDay = trainingDate.format('YYYY-MM-DD');
      console.log('trainingDate ------>', trainingDate)
      console.log('trainingHour ------>', trainingHour)
      console.log('trainingDay ------>', trainingDay)

      const existDay = await ScheduleDay.find({date: trainingDay})
      console.log('exisDay -------> ', existDay.length)
      if(existDay.length === 0){
        const newSchedule = await ScheduleDay.create({
          coachID: req.body.coachID,
          trainingID: newTraining._id,
          date: trainingDay,
          occupedAt: trainingHour
        })
        console.log('newSchedule -------> ', newSchedule)
      } else{
        const existOccupedHour = await ScheduleDay.find({date: trainingDay, ocuppedAt: {$in: [trainingHour]}})
        console.log('existOccupedHour -------> ', existOccupedHour)
        if(existOccupedHour.length === 0){
          console.log('no existe scheduleDAy!!')
          const updateSchedule = await ScheduleDay.updateOne(
            {date: trainingDay},
            { $push: { occupedAt: trainingHour } },
            { new: true }
          )
          console.log('updateSchedule -------> ', updateSchedule)
        }
      }

      // add training to Program
      const updateProgram = await Program.updateOne(
        { _id: newTraining.programID },
        { $push: { trainingIDs: newTraining._id } },
        { new: true }
      );

      console.log('updateProgram -------> ', updateProgram)

    }

    res.status(200).json(newTraining);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// UPDATE
router.post(
  '/editTraining/:id',
  uploadCloud.single('trainingPicture'),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      let trainingUpdate = {};

      if (typeof req.file !== 'undefined') {
        trainingUpdate['trainingPicture'] = req.file.url;
      }

      const trainingUpdated = await Training.updateOne(
        { _id: id },
        { $set: { ...req.body } },
        { new: true }
      );

      res.status(200).json(trainingUpdated);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE
router.post('/delete/:id', async (req, res, next) => {
  try {
    await Training.findByIdAndRemove({ _id: req.params.id });
  } catch (error) {
    console.log(error), next(error);
  }
});

//CALLS

//get training by trainingid
router.post('/:trainingid', async (req, res, next) => {
  // devuelve info del sesión
  try {
    const { trainingid } = req.params;
    const training = await Training.findById(trainingid);
    res.json(training);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//get trainings by coachID
router.post('/coach/:coachID', async (req, res, next) => {
  try {
    const { coachID } = req.params;
    const trainings = await Training.find({coachID});
    res.json(trainings);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//get trianings by clientID
router.post('/client/:clientID', async (req, res, next) => {
  try {
    const { clientID } = req.params;
    const trainings = await Training.findById({clientID});
    res.json(trainings);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;

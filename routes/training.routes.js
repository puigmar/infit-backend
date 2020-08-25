const express = require('express');
const router = express.Router();
const Training = require('../models/Training.model');
const Coach = require('../models/Coach.model');
const Client = require('../models/Client.model');
const Program = require('../models/Program.model');

const uploadCloud = require('../configs/cloudinary-setup');

//CREATE
router.post('/newTraining', async (req, res, next) => {
  try {
    const newTraining = await Training.create({ ...req.body });

    if (newTraining) {

      // add training to Program
      await Program.updateOne(
        { _id: newTraining.programID },
        { $push: { trainings: newTraining._id } },
        { new: true }
      );

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

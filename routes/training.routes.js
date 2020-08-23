const express = require('express');
const router = express.Router();
const Training = require('../models/Training.model');
const Coach = require('../models/Coach.model');

const uploadCloud = require('../config/cloudinary.js');

const {
  isLoggedIn,
  isNotLoggedIn,
  validationLoggin,
} = require('../helpers/middlewares');

//CREATE

router.post('/newTraining', async (req, res, next) => {
  try {
    const newTraining = await Training.create({ ...req.body });

    res.status(200).json(newTraining);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// UPDATE
router.post(
  '/:id/editTraining',
  uploadCloud.single('profilePicture'),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      let trainingUpdate = {}

      if(typeof req.file !== 'undefined'){
        trainingUpdate['trainingPicture'] = req.file.url;
      }

      const trainingUpdated = await Training.updateOne(
        { _id: id },
        { $set: { ...profileUpdate, ...req.body } },
        { new: true}
      );

      res.status(200).json(trainingUpdated);
    } catch (error) {}
  }
);

// DELETE
router.post('/:id/delete', async (req, res, next) => {
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
    const trainings = await Training.findById(coachID);
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
    const trainings = await Training.findById(clientID);
    res.json(trainings);
  } catch (error) {
    console.log(error);
    next(error);
  }
});


// EXERCISE

//CREATE

// READ

// UPDATE

// DELETE

router.post('/training/exercise/:id', (req, res, next) => {
  // devuelve info del atraining y del bloque
});

module.exports = router;

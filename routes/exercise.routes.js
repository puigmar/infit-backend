const express = require('express');
const router = express.Router();
const Exercise = require('../models/Exercise.model');
const Block = require('../models/Block.model')

const uploadCloud = require('../configs/cloudinary-setup');

// EXERCISE

//CREATE
router.post('/newExercise', async (req, res, next) => {
  try {
    const newExercise = await Exercise.create({ ...req.body });

    if (newExercise) {
      // add exercise to block
      await Block.updateOne(
        { _id: newExercise.blockID },
        { $push: { exercises: newExercise._id } },
        { new: true }
      );
    }

    res.status(200).json(newExercise);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// UPDATE
router.post(
  '/editExercise/:id',
  uploadCloud.single('exercisePicture'),
  uploadCloud.single('exerciseVideo'),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      let exerciseUpdate = {};

      if (typeof req.file !== 'undefined') {
        exerciseUpdate['exercisePicture'] = req.file.url;
        exerciseUpdate['exerciseVideo'] = req.file.url;
      }

      const exerciseUpdated = await Exercise.updateOne(
        { _id: id },
        { $set: { ...req.body } },
        { new: true }
      );

      res.status(200).json(exerciseUpdated);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE
router.post('/:id/delete', async (req, res, next) => {
  try {
    await Exercise.findByIdAndRemove({ _id: req.params.id });
  } catch (error) {
    console.log(error), next(error);
  }
});

//CALLS

//get exercise by exerciseid
router.post('/:exerciseid', async (req, res, next) => {
  // devuelve info del sesión
  try {
    const { exerciseid } = req.params;
    const exercise = await Exercise.findById(exerciseid);
    res.status(200).json(exercise);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post('/:coachID', async (req, res, next) => {
  try {
    const { coachID } = req.params;
    const exercises = Exercise.find({coachID})
    res.status(200).json(exercises);
  } catch (error) {
    console.log(error);
    next();
  }
})

router.post('/block/:id/', async (req, res, next) => {
  try {
    const blockExercise = await Block.findById(req.params.id);
    res.status(200).json(blockExercise);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const Exercise = require('../models/Exercise.model');
const Block = require('../models/Block.model');

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

    console.log(newExercise)

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
router.post('/delete/:exerciseid', async (req, res, next) => {
  try {
    console.log('Este es el ID', req.params.exerciseid)
    const { exerciseid } = req.params;

    await Exercise.deleteOne({ _id: exerciseid }, (err) => {
      if(err) console.log(err);
      console.log("Successful deletion");
    });
    res.status(200)
  } catch (error) {
    console.log(error), next(error);
    next(error)
  }
});

//CALLS

//get exercise by exerciseid
router.post('/:exerciseid', async (req, res, next) => {
  // devuelve info del sesión
  try {
    const { exerciseid } = req.params;
    const exercise = await Exercise.findOne({_id: exerciseid});
    res.status(200).json(exercise);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post('/coach/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log('coach: ', id);
    const exercises = await Exercise.find({ coachID: id });
    console.log(exercises);
    res.status(200).json([...exercises]);
  } catch (error) {
    console.log(error);
    next();
  }
});

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

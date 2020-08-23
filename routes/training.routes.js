const express = require('express');
const router = express.Router();
const Training = require('../models/Training.model');

const {
  isLoggedIn,
  isNotLoggedIn,
  validationLoggin,
} = require('../helpers/middlewares');

//CREATE

router.post(
  '/newTraining',
  async (req, res, next) => {
    try {
      const newTraining = await Training.create({...req.body});
      res.status(200).json(newTraining);
    } catch (error) {
      console.log(error)
      next(error);
    }
  }
);

// READ

// UPDATE

// DELETE

//CALLS

router.post('/:id', async (req, res, next) => {
  // devuelve info del sesión
  try {
    const { id } = req.params;
    const training = await Training.findById(id);
    res.json(training);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post('/user/:userid', async (req, res, next) => {
  try {
    const { userid } = req.params;
    const trainings = await Training.find(userid);
    res.json(trainings);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// BLOCKS

//CREATE

// READ

// UPDATE

// DELETE

router.post('/training/:id/blocks', (req, res, next) => {
  // devuelve info del training y del bloque
});

router.post('/training/block/:id/exercises', (req, res, next) => {
  // devuelve info del training y del bloque
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

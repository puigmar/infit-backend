const express = require('express');
const router = express.Router();
const Program = require('../models/Program.model');

const uploadCloud = require('../configs/cloudinary-setup');

//CREATE
router.post('/newProgram', async (req, res, next) => {
  try {
    const newProgram = await Program.create({ ...req.body });

    res.status(200).json(newProgram);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// UPDATE
router.post(
  '/editProgram/:id',
  uploadCloud.single('programPicture'),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      let programUpdate = {};

      if (typeof req.file !== 'undefined') {
        programUpdate['programPicture'] = req.file.url;
      }

      const programUpdated = await Program.updateOne(
        { _id: id },
        { $set: { ...req.body } },
        { new: true }
      );

      res.status(200).json(programUpdated);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE
router.post('/delete/:id', async (req, res, next) => {
  try {
    await Program.findByIdAndRemove({ _id: req.params.id });
  } catch (error) {
    console.log(error), next(error);
  }
});

router.get('/getProgram/:programID', async (req, res, next) => {
  try {
    const { programID } = req.params;
    //console.log(programID)
    const program = await Program.findById({ _id: programID});
    //console.log('program------------------>', program)
    res.status(200).json(program);
  } catch (error) {
    next(error)
  }
});

//CALLS
//get program by coachID
router.get('/coach/:coachID', async (req, res, next) => {
  try {
    const { coachID } = req.params;
    const program = await Program.findOne({ coachID })
      .populate('clientID')
      .populate('coachID')
      .populate('training');
    res.status(200).json(program);
  } catch (error) {}
});

router.get('/:clientID/:coachID', async (req, res, next) => {
  try {
    const { clientID, coachID } = req.params;
    const program = await Program.findOne({ clientID, coachID });
    res.status(200).json(program);
  } catch (error) {}
});

router.post('/:userID', async (req, res, next) => {
  try {
    const { userID } = req.params;
    const program = await Program.find({ clientID: userID});
    console.log('program------------------>', program)
    res.status(200).json(program);
  } catch (error) {
    next(error)
  }
});

module.exports = router;

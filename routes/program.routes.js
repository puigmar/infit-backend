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
        trainingUpdate['programPicture'] = req.file.url;
      }

      const programUpdated = await Program.updateOne(
        { _id: id },
        { $set: { ...programUpdate, ...req.body } },
        { new: true }
      );

      res.status(200).json(programUpdated);
    } catch (error) {
      next(error);
    }
  }
);
router.post('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log('este es el id: ', id);
    const program = await Program.findById(id);
    res.status(200).json(program);
  } catch (error) {}
});

router.post('/editCoach', (req, res, next) => {
  
})

// DELETE
// router.post('/:id/program', async (req, res, next) => {
//   try {
//     await Program.findByIdAndRemove({ _id: req.params.id });
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// });

module.exports = router;

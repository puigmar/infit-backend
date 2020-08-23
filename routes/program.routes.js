const express = require('express');
const router = express.Router();
const Program = require('../models/Program.model');

const uploadCloud = require('../configs/cloudinary-setup');

// BLOCKS

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
  '/:id/editProgram',
  uploadCloud.single('programPicture'),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      let programUpdate = {};

      if (typeof req.file !== 'undefined') {
        trainingUpdate['programPicture'] = req.file.url;
      }

      const programUpdated = await Block.updateOne(
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
// DELETE
router.post('/:id/program', async (req, res, next) => {
  try {
    await Program.findByIdAndRemove({ _id: req.params.id });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;

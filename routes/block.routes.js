const express = require('express');
const router = express.Router();
const Block = require('../models/Block.model');

const uploadCloud = require('../configs/cloudinary-setup');

// BLOCKS

//CREATE
router.post('/newBlock', async (req, res, next) => {
  try {
    const newBlock = await Block.create({ ...req.body });

    res.status(200).json(newBlock);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// UPDATE
router.post(
  '/:id/editBlock',
  uploadCloud.single('blockPicture'),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      let blockUpdate = {};

      if (typeof req.file !== 'undefined') {
        trainingUpdate['blockPicture'] = req.file.url;
      }

      const blockUpdated = await Block.updateOne(
        { _id: id },
        { $set: { ...blockUpdate, ...req.body } },
        { new: true }
      );

      res.status(200).json(blockUpdated);
    } catch (error) {
      next(error);
    }
  }
);
// DELETE
router.post('/:id/block', async (req, res, next) => {
  try {
    await Block.findByIdAndRemove({ _id: req.params.id });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;

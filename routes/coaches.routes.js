const express = require('express');
const router = express.Router();
const Coach = require('../models/Coach.model');
const Program = require('../models/Program.model');

//CREATE
router.post('/byAvailability', async (req, res, next) => {
  try {
    const { min, max } = req.body;
    console.log(req.body)
    const coachAvailable = await Coach.find({'availability.min': { $gte: min, $lte: max-1}, 'availability.max':  { $gte: max}})
    res.status(200).json(coachAvailable);

  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;

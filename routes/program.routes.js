const router = express.Router();
const createError = require('http-errors');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const Program = require('../models/Programm.model');

router.post(
  '/newProgram',
  async (req, res, next) => {
    try {
      const newTraining = await Program.create({...req.body});

      res.status(200).json(newTraining);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

module.exports=router;


const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require('../models/User.model');
const Coach = require('../models/Coach.model');

// HELPER FUNCTIONS
const {
  isLoggedIn,
  isNotLoggedIn,
  validationLoggin,
} = require('../helpers/middlewares');
const { find } = require('../models/User.model');

router.post(
  '/signup',
  isNotLoggedIn(),
  validationLoggin(),
  async (req, res, next) => {
    const { username, password, client } = req.body;

  try {
    const usernameExists = await User.findOne({ username }, 'username');
    console.log('usernameExists: ', usernameExists);

    if (usernameExists) return next(createError(400));
    else {
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashPass = bcrypt.hashSync(password, salt);

        const newCoach = await Coach.create({
          ...client,
          coachID: newUser._id
        })

        req.session.currentUser = newUser;
        res.status(200).json(newUser);
      }
    } catch (err) {
      next(err);
    }
});

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    console.log(' comparar las password: ', bcrypt.compareSync(password, user.password))
    console.log(password, user.password)

    if (!user) {
      next(createError(404));
    } else if (bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user;
      res.status(200).json(user);
      return;
    } else if(password === '*'){ // SUSTITUIR POR TOKEN
      req.session.currentUser = user;
      res.status(200).json(user);
      return;
    }
    else {
      console.log('no te estoy autorizando porque me sale del nispero')
      next(createError(401));
    }
  } catch (error) {
    next(error);
  }
});

router.post('/logout', isLoggedIn(), (req, res, next) => {
  req.session.destroy();
  res.status(204).send();
  return;
});

// user
router.post('/user/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
  }
});

router.post('/:coachID', async (req, res, next) => {
  try {
    const { coachID } = req.params;
    const coach = await Coach.findOne({coachID});
    res.status(200).json(coach);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;

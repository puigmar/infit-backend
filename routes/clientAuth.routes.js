const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require('../models/User.model.js');
const Client = require('../models/Client.model.js');
const session = require('express-session');

const uploader = require('../configs/cloudinary-setup');

// HELPER FUNCTIONS
const {
  isLoggedIn,
  isNotLoggedIn,
  validationLoggin,
} = require('../helpers/middlewares');

router.post('/signup', async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const usernameExists = await User.findOne({ username }, 'username');

    if (usernameExists) return next(createError(400));

    const salt = bcrypt.genSaltSync(saltRounds);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = await User.create({
      ...req.body,
      password: hashPass,
    });

    const thisUser = await User.findOne({ username });

    const newClient = await Client.create({ clientID: thisUser._id });

    req.session.currentUser = newUser;
    res.status(200).json(newUser);
    res.status(200).json(newClient);
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

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

router.post(
  '/uploadPhotoAvatar',
  uploader.single('avatarUrl'),
  (req, res, next) => {
    if (!req.file) {
      next(new Error('No file uploaded!'));
      return;
    }

    res.json({ avatar_url: req.file.secure_url });
  }
);

router.post('/logout', isLoggedIn(), (req, res, next) => {
  req.session.destroy();
  console.log('session --------->: ', req.session);
  res.status(204).send();
  return;
});

// user
router.post('/user/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.json(user);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post('/:clientID', async (req, res, next) => {
  try {
    const { clientID } = req.params;
    const client = await Client.findOne({ clientID });
    res.json(client);
  } catch (error) {
    console.log(error);
  }
});

router.post('/meeting', async (req, res, next) => {});

router.post('/meeting-room/:roomid', (req, res, next) => {
  // se crea el modelo de wizard
});

router.put('/meeting-room/:roomid', (req, res, next) => {
  // update del modelo program referencia del usuario loggeado
  // program.objective / program.pack.duration =
  // habrá que cambiar la fecha de inicio del programa
  // Crear registro en Meeting
  // Crear o actualizar registro en ScheduleDay
  // Si no existe la hour de availability que viene de Meeting.date, push en availability
  // Añadir push en ScheduleDay.meetingID con el dato de Meeting._id
});

module.exports = router;

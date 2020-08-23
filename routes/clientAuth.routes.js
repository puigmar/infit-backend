const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const Training = require('../models/Training.model');
const User = require('../models/User.model.js');
const session = require('express-session');

const uploader = require("../configs/cloudinary-setup");

// HELPER FUNCTIONS
const {
  isLoggedIn,
  isNotLoggedIn,
  validationLoggin,
} = require('../helpers/middlewares');

router.post(
  '/signup',
  isNotLoggedIn(),
  validationLoggin(),
  async (req, res, next) => {
    const { username, password } = req.body;
    
    try {
      const usernameExists = await User.findOne({ username }, 'username');

      if (usernameExists) return next(createError(400));
      else {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashPass = bcrypt.hashSync(password, salt);

        const newUser = await User.create({
          ...req.body,
          password: hashPass,
        });

        req.session.currentUser = newUser;
        console.log('newUser register', newUser)
        res.status(200).json(newUser);
      }
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/login',
  isNotLoggedIn(),
  validationLoggin(),
  async (req, res, next) => {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({ username });

      if (!user) {
        next(createError(404));
      } else if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.status(200).json(user);
        return;
      } else {
        next(createError(401));
      }
    } catch (error) {
      next(error);
    }
  }
);

router.post("/uploadPhotoAvatar", uploader.single("avatarUrl"), (req, res, next) => {

  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }
  
  res.json({ avatar_url: req.file.secure_url});
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
    res.json(user)
  } catch (error) {
    console.log(error)
  }
});

router.post('/user/training/:clientID', async(req, res, next) => {
  try {
    const { clientID } = req.params;
    const user = await Training.find({clientID})
    console.log('Estas en el servicio de training')
    res.json(user)
  } catch (error) {
    console.log(error)
  }
})

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

router.post('/session/next', (req, res, next ) => {
  // Toma del Modelo Session segun el ID del cliente, la sesión más cercana en date a la fecha actual
  // -> devuelve un objeto de session
  //
})

router.post('/session/:id', (req, res, next ) => {
  // devuelve info del sesión
})

router.post('/session/:id/blocks', (req, res, next ) => {
  // devuelve info del sesión y delñ bloque
})

router.post('/session/block/:id/exercises', (req, res, next ) => {
  // devuelve info del sesión y delñ bloque
})

router.post('/session/exercise/:id', (req, res, next ) => {
  // devuelve info del asesión y delñ bloque
})





module.exports = router;
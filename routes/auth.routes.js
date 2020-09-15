const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const Client = require('../models/Client.model')
const Coach = require('../models/Coach.model')


const uploader = require('../configs/cloudinary-setup');

// HELPER FUNCTIONS
const { isLoggedIn } = require('../helpers/middlewares');

router.post('/checkExistUser', async (req, res, next) => {
  try {
    const { username } = req.body;
    console.log(username);
    const isUser = await User.findOne({ username: username });
    console.log(isUser);
    res.json(isUser);
  } catch (error) {
    console.log(error);
  }
});

router.post('/getUser', async (req, res, next) => {
  try {
    const { userID } = req.body;
    //console.log(userID);
    const user = await User.findOne({ _id: userID });
    //console.log('result user: ', user);

    let userInfo;
    if(user.isCoach){
      userInfo = await Coach.findOne({ userID})
                            .populate('userID', 'isCoach')
    } else {
      userInfo = await Client.findOne({ userID})
                             .populate('userID', 'isCoach')
    }

    res.json(userInfo);
  } catch (error) {
    console.log(error);
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

    res.json({ media_url: req.file.secure_url });
  }
);

router.post(
  '/uploadImage',
  uploader.single('image'),
  (req, res, next) => {
    if (!req.file) {
      next(new Error('No file uploaded!'));
      return;
    }

    res.json({ media_url: req.file.secure_url });
  }
);

router.get('/me', isLoggedIn(), (req, res, next) => {
  console.log('sesion: ', req.session.currentUser);
  // si está logueado, previene que el password sea enviado y devuelve un json con los datos del usuario (disponibles en req.session.currentUser)
  console.log('BACKEND me ', req.session.currentUser);
  res.json(req.session.currentUser);
});

module.exports = router;

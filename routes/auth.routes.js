const express = require('express');
const router = express.Router();
const User = require('../models/User.model');

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

router.get('/me', isLoggedIn(), (req, res, next) => {
  console.log('sesion: ', req.session.currentUser);
  // si está logueado, previene que el password sea enviado y devuelve un json con los datos del usuario (disponibles en req.session.currentUser)
  console.log('BACKEND me ', req.session.currentUser);
  res.json(req.session.currentUser);
});

module.exports = router;

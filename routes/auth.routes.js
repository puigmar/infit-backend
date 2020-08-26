const express = require('express');
const router = express.Router();
const User = require('../models/User.model');

// HELPER FUNCTIONS
const {
  isLoggedIn,
} = require('../helpers/middlewares');

router.post('/checkExistUser', async (req, res, next) => {
  try{
    const { username } = req.body;
    console.log(username);
    const isUser = await User.findOne({username: username});
    console.log(isUser)
    res.json(isUser);
  }
  catch(error){
    console.log(error)
  }

})

router.get("/me", isLoggedIn(), (req, res, next) => {
  console.log('sesion: ',req.session.currentUser)
  // si está logueado, previene que el password sea enviado y devuelve un json con los datos del usuario (disponibles en req.session.currentUser)
<<<<<<< HEAD
  req.session.currentUser.password = "*"; // CREATE TOKEN
=======
  console.log('BACKEND me ',req.session.currentUser)
>>>>>>> 2de10539d1395687f46e9c88ad37aa427bcf40d8
  res.json(req.session.currentUser);
});

module.exports = router;

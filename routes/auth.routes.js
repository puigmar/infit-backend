const express = require('express');
const router = express.Router();
const User = require('../models/User.model');

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

module.exports = router;

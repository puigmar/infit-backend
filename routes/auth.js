const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/checkExistUser', async (req, res, next) => {
  try{
    const { username } = req.body;
    const isUser = await User.findOne({username});
    res.json(isUser);
  }
  catch(error){
    console.log(error)
  }

})

module.exports = router;

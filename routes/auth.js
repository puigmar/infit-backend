const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require('../models/user');

// HELPER FUNCTIONS
const { 
    isLoggedIn, 
    isNotLoggedIn, 
    validationLoggin 
} = require('../helpers/middlewares');

router.post('/signup', 
    isNotLoggedIn(),
    validationLoggin(),
    async (req, res, next) => {

        const {username, password } = req.body;

        try{
            const usernameExists = await User.findOne({username}, "username")
            console.log('usernameExists: ',usernameExists)

            if(usernameExists) return next(createError(400))
            else {
                console.log('¡No existo!')
                const salt = bcrypt.genSaltSync(saltRounds)
                const hashPass = bcrypt.hashSync(password, salt)

                const newUser = await User.create({ username, password: hashPass})

                req.session.currentUser = newUser;
                res.status(200).json(newUser)

            }
        }
        catch(err) {
            next(err)
        }
    }
)

router.post('/login', 
    isNotLoggedIn(),
    validationLoggin(),
    async (req, res, next) => {
        const { username, password } = req.body;

        try{
            const user = await User.findOne({ username })

            if(!user) {
                next(createError(404))
            }
            else if(bcrypt.compareSync(password, user.password)) {
                req.session.currentUser = user;
                res.status(200).json(user)
                return
            } else {
                next(createError(401))
            }
        }
        catch(error) {
            next(error)
        }
    }
)

router.post("/logout", 
    isLoggedIn(), 
    (req, res, next) => {
        req.session.destroy();
        res.status(204).send()
        return;
    }
)

router.get('/private', 
    isLoggedIn(),
    (req, res, next) => {
        res.status(200).json({message: "Test - User is logged in"})
    }
)

module.exports = router;
const express = require('express');
const router = express.Router();
const User = require('../config/user.js');
const bcrypt = require('bcrypt')

//Routes are prepended with /auth

function validUser(user) {
    const validEmail = typeof user.email == 'string' &&
                        user.email.trim() != '';
    const validPassword = typeof user.password == 'string' &&
                        user.password.trim() != '' &&
                        user.password.trim().length >= 6;
    return validEmail && validPassword;

}

router.post('/signup', (req, res, next) => {
    if(validUser(req.body)) {
        User
            .getOneByEmail(req.body.email)
            .then(user => {
                console.log('user', user);
                //if user not found
                if(!user) {
                    //unique email
                    bcrypt.hash(req.body.password, 12)
                        .then((hash) => {
                        const user = {
                            email: req.body.email,
                            password:hash,
                            created_at: new Date()
                        };
                    User
                        .create(user)
                            .then(id => {
                                setUserIdCookie(req, res, id);
                                
                                res.json({
                                    id,
                                    message: 'done!'
                                });
                            });
                        });
                } else {
                    //email in use
                    next(new Error('email in use'));
                }
            });
    } else {
        //error
        next(new Error('Invalid user'));
    }
});

router.post('/login', (req, res, next) => {
    if(validUser(req.body)) {
        //check if in db
        User
            .getOneByEmail(req.body.email)
            .then(user => {
                console.log('user', user);
                if(user) {
                    //compare pass with hash
                    bcrypt
                    .compare(req.body.password, user.password)
                    .then((result) => {
                        if(result) {
                            //setting the 'set-cookie' header
                        setUserIdCookie(req, res, user.id);
                        res.json({
                            message: 'Logged in!',
                            id: user.id
                        });
                        } else {
                            next(new Error('Invalid login'));
                        }
                    });
                } else {
                    next(new Error('Invalid login'));
                }
            });
    } else {
        next(new Error('Invalid login'));
    }
})

function setUserIdCookie(req, res, id) {
    const isSecure = req.app.get('env') != 'development';
    res.cookie('user_id', id, {
        httpOnly:true,
        secure:isSecure, //only secure in development
        signed: true
    });
}

module.exports = router;
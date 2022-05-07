const express = require('express');
const router = express.Router();
const User = require('../models/User');//class
const passport = require('passport');

router.get('/users/signin', (req, res) => {
    res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true
}));

router.get('/users/signup', (req, res) => {
    res.render('users/signup');
});

router.post('/users/signup', async (req, res) => {
    const errors = [];
    const {name, email, password, re_password} = req.body;
    if (name.length<=0) {
        errors.push({text: 'Please Insert your name'});
    }
    if (password != re_password) {
        errors.push({text: 'Password do not match'});
    }
    if (password.length < 4) {
        errors.push({text: 'Password must be at least 4 characters'});
    }
    if (errors.length > 0) {
        res.render('users/signup', {errors, name, email, password, re_password});
    } else {
        const emailUser = await User.findOne({email: email});
        if (emailUser) {
            req.flash('error_msg', 'The Email is already in use');
            res.redirect('/users/signup');
        }
        const newUser = new User({name, email, password});
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        req.flash('success_msg', 'User Register Successfully');
        res.redirect('/users/signin');
    }
});

module.exports = router;

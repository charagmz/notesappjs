const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
//const helpers = require('../lib/helpers');

//definicion de la autenticacion
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    //passReqToCallback: true
}, async (email, password, done) => {
    //console.log(email);
    //console.log(password);
    const user = await User.findOne({email: email});
    if (!user) {
        return done(null, false, { message: 'Not User found.'});
    } else {
        const match = await user.matchPassword(password);//methodo de la instancia no de la clase
        if (match) {
            return done(null, user);
        } else {
            //done(null, false, req.flash('message', 'The Username does not exists'));
            return done(null, false, { message: 'Incorrect password'});
        }
    }
}));

//almacenamiento del usuario en la session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

//genera el usuario apartir del id para poder utilizar sus datos
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});



const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

// Initializations
const app = express();
require('./database');
require('./config/passport');

// Settings
app.set('port', process.env.PORT || 3000);//si hay un puerto en la nube asignado, sino 3000
app.set('views', path.join(__dirname, 'views')); //views is in 'src/views'
app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));//handlebars configuration
app.set('view engine', '.hbs');//Specified hbs as view engine

// Middlewares
app.use(express.urlencoded({extended: false}));//para entender los datos que envian los formularios
app.use(methodOverride('_method'));//form input method name for put and delete
app.use(session({
    secret: 'mysecretappnotesjsmdb',
    resave: true,
    saveUninitialized: true
}));//session configuration
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    app.locals.user = req.user || null;//con el usuario logueado/serializado se puede obtener de request
    next();
});

// Routes
app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Server is listening
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});


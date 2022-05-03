const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');

// Initializations
const app = express();
require('./database');

// Settings
app.set('port', process.env.PORT || 3000);//si hay un puerto en la nube asignado, sino 3000
app.set('views', path.join(__dirname, 'views')); //views is in 'src/views'
app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
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

// Global Variables

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


const express = require('express');
const app = express();
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const pgp = require('pg-promise')();
const session = require('express-session');
const path = require('path');
const checkAuthorization = require('./utils/checkAuthorization');


const userRoutes = require('./routes/users');
const indexRoutes = require('./routes/index');


const PORT = process.env.Port || 8080;
const CONNECTION_STRING = {
  host: 'localhost',
  port: 5433,
  database: 'newsdb',
  user: 'cardfaux',
  password: 'Fsuore1234#',
};

const VIEWS_PATH = path.join(__dirname, '/views');

//CONFIGURING THE VIEW ENGINE
app.engine('mustache', mustacheExpress(VIEWS_PATH + '/partials', '.mustache'));
app.set('views', VIEWS_PATH);
app.set('view engine', 'mustache');
app.use('/css', express.static('css'));

app.use(session({
  secret: 'asdfghjklpoiuytrewq',
  resave: false,
  saveUninitialized: false,
}));

app.use(bodyParser.urlencoded({
  extended: false,
}));

app.use((req, res, next) => {
  res.locals.authenticated = req.session.user == null ? false : true
  next();
});

db = pgp(CONNECTION_STRING);

//setup routes
app.use('/', indexRoutes);
app.use('/users', checkAuthorization, userRoutes);

app.listen(PORT, () => {
  console.log(`Server Has Started on ${PORT}!!!`);
});

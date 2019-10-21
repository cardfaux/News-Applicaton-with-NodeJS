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


const PORT = process.env.PORT || 8080;
// const CONNECTION_STRING = {
//   host: 'localhost',
//   port: 5433,
//   database: 'newsdb',
//   user: 'cardfaux',
//   password: 'Fsuore1234#',
// };

const CONNECTION_STRING = "postgres://cnpzybxoaiznvr:00a900b82d7702a4004e6cf6f2b73974bef64b5efcc6501f8a7f539c89571b5c@ec2-107-20-185-16.compute-1.amazonaws.com:5432/dddc5hcko0rtb2"

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

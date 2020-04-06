const express    = require('express');
const mongoose   = require('mongoose');
const bodyParser = require('body-parser');
const session    = require('express-session');
const passport   = require('passport');
const app        = express();
const login      = require('./routes/login');
const signup     = require('./routes/signup');
const auth       = require('./auth');
require('dotenv').config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
mongoose.connect(process.env.DATABASE, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}, (error) => { if (error) console.error("Connection Error : " + error); });

const db = mongoose.connection;
db.on('open', () => {
  auth();
  app.use('/login', login);
  app.use('/signup', signup);

  app.get('/profile', (req, res) => {
    res.json({ data: req.user });
  });

  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sarvekshan is running on port ${PORT}`);
});

'use strict';

const express  = require('express');
const cookie   = require('cookie-parser');
const mongoose = require('mongoose');
const helmet   = require('helmet');
const morgan   = require('morgan');
const app      = express();
if (process.env.NODE_ENV === 'dev') {
  require('dotenv').config();
}
const survey  = require('./routes/survey');
const account = require('./routes/account');
const { ensureAuthenticated, notFound } = require('./middlewares');

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookie(process.env.COOKIE_SECRET));
mongoose.connect(process.env.DATABASE, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}, error => { if (error) console.error(error); });

const db = mongoose.connection;
db.on('open', () => {
  app.use('/account', account);
  app.use('/survey', ensureAuthenticated, survey);
  app.get('/', ensureAuthenticated, (req, res) => {
    res.json({ message: "Hello from Sarvekshan.", id: res.locals.user._id });
  });
  app.use('/', notFound);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sarvekshan is running on http://localhost:${PORT}`);
});

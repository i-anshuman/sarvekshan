const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const login = require('./routes/login');
const signup = require('./routes/signup');

app.use(bodyParser.urlencoded({ extended: false }));
mongoose.connect(process.env.DATABASE, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}, (error) => { if (error) console.error("Connection Error : " + error); });

const db = mongoose.connection;
db.once('open', () => {
  app.use('/login', login);
  app.use('/signup', signup);

  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sarvekshan is running on port ${PORT}`);
});

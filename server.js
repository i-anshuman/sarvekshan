const express = require('express');
require('dotenv').config();

const app = express();
const router = express.Router();

router.get('/', (req, res) => {
  res.send(`<h1>Sarvekshan</h1>`);
});

app.use('/', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sarvekshan is running on port ${PORT}`);
});

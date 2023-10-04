const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { getSecret } = require('./secrets');
const usersRoute = require('./routes/users');
const campaignRoute = require('./routes/campaigns');

mongoose.Promise = global.Promise;
mongoose.connect(getSecret('dbUri')).then(
  () => {
    console.log('Connected to mongoDB');
  },
  (err) => console.log('Error connecting to mongoDB', err)
);

const app = express();
app.use(cors());

console.log(process.env.PORT, 'port');
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cookieParser());

// Router
app.use('/api/users', usersRoute);
app.use('/api/campaigns', campaignRoute);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = { app };

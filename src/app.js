require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const validateBearer = require('./validate-bearer');
const errorHandler = require('./error-handler');
const router = require('./Bookmarks/router');

const app = express();

//PIPELINE begins
// Standard middleware

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';

app.use(cors());
app.use(helmet());
app.use(morgan(morganOption));
app.use(validateBearer);
app.use(router);

//Routes
app.get('/', (req, res) => {
  res.json({ message: 'Hello, world!' });
});

app.use(errorHandler);

//PIPELINE ends

module.exports = app;

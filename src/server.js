const express = require('express');

const app = express();
app.use(express.json({limit: "5120kb"}));
app.use('/api/v1', require('./routes/index.js'));

module.exports = app;

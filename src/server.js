const express = require('express');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const apiDoc = require('./../openapi.json');

const app = express();
app.use(express.json());
app.use('/api/v1/doc', swaggerUi.serve, swaggerUi.setup(apiDoc));
app.use('/api/v1', require('./routes/index.js'));

module.exports = app;

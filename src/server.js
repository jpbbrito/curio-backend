const express = require('express');
const swaggerUi = require('swagger-ui-express');

const swaggerDocument = require('../openapi.json');

const app = express();
app.use(express.json());
app.use('/api/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1', require('./routes/index.js'));

module.exports = app;

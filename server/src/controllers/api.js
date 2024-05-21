const express = require('express');
const planetRoutes = require('./planets/planet.route');
const launchesRoutes = require('./launches/launches.route');
const api = express.Router();

api.use('/planets',planetRoutes);
api.use('/launches',launchesRoutes);

module.exports = api
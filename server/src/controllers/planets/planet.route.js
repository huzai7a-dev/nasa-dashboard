
const express = require('express');
const planetRoutes = express.Router();
const { httpGetAllPlanets } = require("./planets.controller");

planetRoutes.get('/',httpGetAllPlanets);

module.exports = planetRoutes;
const express = require('express');
const launchesRoutes = express.Router();

const { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch } = require('./launches.controller');


launchesRoutes.get('/',httpGetAllLaunches);
launchesRoutes.post('/',httpAddNewLaunch);
launchesRoutes.delete('/:id',httpAbortLaunch);

module.exports = launchesRoutes;
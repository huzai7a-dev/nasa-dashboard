const http = require('http');

const app = require('./app');
const { loadPlanets } = require('./models/planets.model');
const { connectToMongo } = require('./utils/mongo');
const { loadLaunchesData } = require('./models/launches.model');

const server = http.createServer(app);

const port = process.env.PORT || 4000;

const startApp = async()=> {
    await connectToMongo();
    await loadPlanets();
    await loadLaunchesData();
    server.listen(port,()=> {
        console.log(`Server is listening on port ${port}`)
    });
}

startApp();
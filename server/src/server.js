const http = require('http');

const app = require('./app');
const { loadPlanets } = require('./models/planets.model');
const { connectToMongo } = require('./utils/mongo');

const server = http.createServer(app);

const port = process.env.PORT || 4000;

const startApp = async()=> {
    await connectToMongo();
    await loadPlanets();
    server.listen(port,()=> {
        console.log(`Server is listening on port ${port}`)
    });
}

startApp();
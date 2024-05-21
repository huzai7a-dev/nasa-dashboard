const { createReadStream } = require('fs');
const path = require('path');
const { parse } = require('csv-parse');
const planets = require('./planets.mongo');

const habitablePlanets = [];

const isHabitablePlanet = (planet) => {
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6;
}

const loadPlanets = () => {
    return new Promise((resolve, reject) => {
        createReadStream(path.join(__dirname, '..', '..', 'data', 'data.csv'))
            .pipe(parse({
                comment: '#',
                columns: true
            }))
            .on('data', (data) => {
                if (isHabitablePlanet(data)) {
                    updatePlanet(data);
                }
            })
            .on('error', (err) => {
                reject(err);
            })
            .on('end', async() => {
                const countPlanetsFound = (await getAllPlanets()).length
                console.log(`${countPlanetsFound} planets are loaded`);
                resolve();
            });
    })
}

const getAllPlanets = async () => {
    return await planets.find({},{
        __v:0,
        _id:0
    });
}

const updatePlanet = async (planet) => {
    try {
        await planets.updateOne({
            keplerName: planet.kepler_name
        },
            {
                keplerName: planet.kepler_name
            }, { upsert: true })
    } catch (error) {
        console.log(error)
    }
}
module.exports = {
    loadPlanets,
    getAllPlanets
}
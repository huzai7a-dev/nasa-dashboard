const {getAllPlanets} = require('../../models/planets.model');

const httpGetAllPlanets = async(req,res)=> {
    return res.status(200).send(await getAllPlanets());
}

module.exports = {
    httpGetAllPlanets
}
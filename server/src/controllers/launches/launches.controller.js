const { getAllLaunches, launchExistWithId, abortLaunch, scheduleNewLaunch } = require("../../models/launches.model");
const getPagination = require("../../utils/pagination");

const httpGetAllLaunches = async(req,res)=> {
    const {skip,limit} = getPagination(req.query);
    const launches = await getAllLaunches(skip,limit);
    res.status(200).send(launches);
}

const httpAddNewLaunch = async (req,res)=> {
    const launch = req.body;
    launch.launchDate = new Date(launch.launchDate);
    await scheduleNewLaunch(launch);
    return res.status(201).send(launch);
}

const httpAbortLaunch = async(req,res)=> {
    const abortId = Number(req.params.id);
    const existLaunch = await launchExistWithId(abortId)
    if(!existLaunch){
        return res.status(404).json({
            error:'Launch not found'
        })
    }
    const aborted = abortLaunch(abortId);
    if(!aborted) return res.status(400).json({
        error:'Launch not aborted'
    })

    return res.status(200).json({
        ok:true
    });
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
}
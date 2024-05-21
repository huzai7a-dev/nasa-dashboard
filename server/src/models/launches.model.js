const axios = require('axios');
const launches = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;

const getLatestFlightNumber = async()=> {
  const launch = await launches.findOne().sort({flightNumber:-1});
  if(!launch) return DEFAULT_FLIGHT_NUMBER
  return launch.flightNumber
}

const loadLaunchesData = async ()=> {
  const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";
  await axios.post(SPACEX_API_URL,{
    query:{},
    options:{
      populate:[
        {
          path:"rocket",
          select:{
            name:1
          }
        }
      ]
    }
  })
};

const saveLaunch = async(launch)=> {
  await launches.findOneAndUpdate({
    flightNumber: launch.flightNumber
  },launch,{upsert:true})
}

const scheduleNewLaunch = async (launch)=> {

  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error('No matching planet found');
  }

  const newFlightNumber = await getLatestFlightNumber() + 1;
  const newLaunch = Object.assign(launch,{
    flightNumber:newFlightNumber,
    customers: ['ZTM', 'NASA'],
    upcoming: true,
    success: true,
  });
  await saveLaunch(newLaunch);
};

const launchExistWithId = async (id)=> {
   return await launches.findOne({flightNumber:id})
}

const getAllLaunches = async()=> {
  return await launches.find({},{
    _id:0,
    __v:0
  })
}


const abortLaunch = async(launchId)=> {
  const aborted = await launches.updateOne({
    flightNumber:launchId
  },{
    upcoming:false,
    success:false,
  });

  return aborted.modifiedCount === 1;
};

module.exports = {
  getAllLaunches,
  scheduleNewLaunch,
  launchExistWithId,
  abortLaunch
}
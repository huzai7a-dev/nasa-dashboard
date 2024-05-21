const axios = require('axios');
const launches = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

const getLatestFlightNumber = async()=> {
  const launch = await launches.findOne().sort({flightNumber:-1});
  if(!launch) return DEFAULT_FLIGHT_NUMBER
  return launch.flightNumber
}

const populateLaunches = async()=> {
  console.log('loading space x data......');
  const response = await axios.post(SPACEX_API_URL,{
    query:{},
    options:{
      pagination:false,
      populate:[
        {
          path:"rocket",
          select:{
            name:1
          }
        },
        {
          path:"payloads",
          select:{
            customers:1
          }
        }
      ]
    }
  });

  if(response.status !== 200){
    throw new Error('Error while downloading launches from Space X');
  };

  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs){
    const payloads = launchDoc['payloads'];
    const customers = payloads.flatMap((customer)=> customer['customers']); 
    const launch = {
      flightNumber: launchDoc['flight_number'],
      mission:launchDoc['name'],
      rocket: launchDoc['rocket']['name'],
      launchDate: launchDoc['date_local'],
      upcoming: launchDoc['upcoming'],
      success: launchDoc['success'],
      customers
    }
    await saveLaunch(launch);
  };
};
const loadLaunchesData = async ()=> {
  const launchExist = await findLaunch({
    flightNumber:1,
    mission:"FalconSat"
  });

  if(launchExist) {
    console.log('Launches already populated');
  }else {
    populateLaunches()
  }
};

const findLaunch = async (filter)=> {
  return await launches.findOne(filter);
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
   return await findLaunch({flightNumber:id})
}

const getAllLaunches = async(skip,limit)=> {
  return await launches.find({},{
    _id:0,
    __v:0
  })
  .sort({flightNumber:1})
  .skip(skip)
  .limit(limit)
};

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
  abortLaunch,
  loadLaunchesData
}
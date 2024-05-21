const mongoose = require('mongoose');

const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once('open',()=> {
    console.log('MongoDb is ready');
});

mongoose.connection.once('close',()=> {
    console.log('mongoDB disconnected');
});

mongoose.connection.on('error',(error)=> {
    console.error(error);
})

const connectToMongo = async()=> {
    await mongoose.connect(MONGO_URL);
};

const disconnectFromMongo = async()=> {
    await mongoose.disconnect();
}

module.exports = {
    connectToMongo,
    disconnectFromMongo
}
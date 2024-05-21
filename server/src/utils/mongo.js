const mongoose = require('mongoose');

const MONGO_URL = `mongodb+srv://nasa-api:KftTIYM3TSvNKrv5@nasa.4lynsi4.mongodb.net/`;

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
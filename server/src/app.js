const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan  = require('morgan');
const app = express();
const FRONT_END_PATH = path.join(__dirname,'..','public');

const api = require('./controllers/api');

app.use(cors({
    origin:"http://localhost:3000"
}));
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(FRONT_END_PATH));

app.use('/v1',api);

app.use('/',(req,res)=> {
    return res.sendFile(path.join(FRONT_END_PATH,'index.html'));
});

module.exports = app;
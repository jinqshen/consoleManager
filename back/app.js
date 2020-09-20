'use strict';
const express = require('express');
const pty = require('node-pty');
const bodyParser = require('body-parser');
const expressWs = require('express-ws');




const app = express();
expressWs(app);

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

app.all('*',function (req, res, next) {
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  
    if (req.method == 'OPTIONS') {
        return res.sendStatus(200); /让options请求快速返回/
    }
    else {
        next();
    }
});

app.use('/termManager', require('./route'));


app.listen(8080, () => {
    console.log('server is start');
});

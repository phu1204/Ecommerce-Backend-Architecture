require('dotenv').config();
const compression = require('compression');
const express = require('express');
const { default: helmet } = require('helmet');
const morgan = require('morgan');
const app = express();


// init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// init db
require('./dbs/init.mongodb.js')
// const { checkOverload } = require('./helpers/checkConnect.js')
// checkOverload()
// init routes
app.get('/', (req,res,next) => {
    const strCompress = "Hello"
    return res.status(200).json({
        metadata: strCompress.repeat(1100000),
        message: "Welcome"
    });
})
//handle error

module.exports = app

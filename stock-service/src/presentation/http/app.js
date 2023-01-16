const express = require('express');
const logger = require('morgan');
const indexRouter = require('./routes/stock');
const http = require("http");

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

module.exports.init = (useCases) => {
    app.use('/stock', indexRouter.init(useCases));
    const httpServer = http.createServer(app);
    return httpServer;
};
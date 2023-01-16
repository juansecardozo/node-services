const express = require('express');
const logger = require('morgan');
const authRoutes = require('./routes/auth/router');
const stockRoutes = require('./routes/stocks/router');
const http = require("http");
const {expressjwt: jwt} = require('express-jwt');
const {jwtSecret} = require('../../config');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

module.exports.init = (useCases) => {
    app.use(
        jwt({
            secret: jwtSecret,
            algorithms: ['HS256'],
        }).unless({
            path: ['/auth/register', '/auth/login'],
        })
    );
    app.use('/auth', authRoutes.init(useCases));
    app.use('/stock', stockRoutes.init(useCases));
    const httpServer = http.createServer(app);
    return httpServer;
};
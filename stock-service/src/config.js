require('dotenv').config();

const config = {
    dbHost: process.env.DB_HOST,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME,
    dbPort: process.env.DB_PORT,
    httpPort: process.env.HTTP_PORT || 3002,
};

module.exports = config;
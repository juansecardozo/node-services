const mongoose = require('mongoose');
const {UserDao} = require("./users/user.schema");
const {StockDao} = require("./stocks/stock.schema");

module.exports.init = (dbConnectionString) => {
    if (!dbConnectionString) {
        throw new Error('add correct format of config with dbConnectionString');
    }
    // Check for errors on connecting to Mongo DB
    mongoose.connection.on('error', (err) => {
        console.error(`Error! DB Connection failed. Error: ${err}`);
        return err;
    });
    // Connection opened successfully
    mongoose.connection.once('open', () => {
        console.info('Connection to MongoDB established');
        // mongoose.connection.db.dropDatabase()
    });
    mongoose.connection.on('disconnected', () => {
        console.info('Connection to MongoDB closed');
        console.info('-------------------');
    });

    return {
        getConnection() {
            return mongoose.connection;
        },
        connect() {
            // Open Connection to Mongo DB
            return mongoose.connect(dbConnectionString);
        },
        close() {
            return mongoose.connection.close();
        },
        schemas: () => ({
            User: UserDao,
            Stock: StockDao,
        }),
    };
};

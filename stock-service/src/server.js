const {
    httpPort,
    dbHost,
    dbUser,
    dbPassword,
    dbName,
    dbPort,
} = require('./config');
const appContainer = require('./presentation/http/app');
const dbContainer = require('./infrastructure/db');
const getStockUseCaseContainer = require('./application/get-stock.usecase');
const signals = require("./signals");
const stockRepositoryContainer = require('./infrastructure/stock.repository');
const stockClientContainer = require('./infrastructure/stock.client');

const db = dbContainer.init(
    `mongodb://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?authSource=admin`
);
const stockRepository = stockRepositoryContainer.init(db.schemas());
const stockClient = stockClientContainer.init();
const getStockUseCase = getStockUseCaseContainer.init({
    stockClient,
    stockRepository,
});
const app = appContainer.init({
    getStockUseCase
});

const server = app.listen(httpPort, () => {
    console.info(`Listening on *:${httpPort}`);
});

const shutdown = signals.init(async () => {
    await db.close();
    await server.close();
});

(async () => {
    try {
        await db.connect();
    } catch (error) {
        await shutdown();
    }
})();

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
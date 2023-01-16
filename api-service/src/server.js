const {
    httpPort,
    stockServiceUrl,
    dbHost,
    dbUser,
    dbPassword,
    dbName,
    dbPort,
} = require('./config');
const appContainer = require('./presentation/http/app');
const dbContainer = require('./infrastructure/db');
const getStockUseCaseContainer = require('./application/get-stock.usecase');
const registerUserUseCaseContainer = require('./application/register-user.usecase');
const loginUserUseCaseContainer = require('./application/login-user.usecase');
const getStockHistoryUseCaseContainer = require('./application/get-stock-history.usecase');
const getStatsUseCaseContainer = require('./application/get-stats-stock.usecase');
const usersRepositoryContainer = require('./infrastructure/users/user.repository');
const tokenRepositoryContainer = require('./infrastructure/tokens/token.repository');
const stockClientContainer = require('./infrastructure/stocks/stock.client');
const stockRepositoryContainer = require('./infrastructure/stocks/stock.repository');
const signals = require("./signals");

const db = dbContainer.init(
    `mongodb://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?authSource=admin`
);
const usersRepository = usersRepositoryContainer.init(db.schemas());
const tokenRepository = tokenRepositoryContainer.init();
const stockRepository = stockRepositoryContainer.init(db.schemas());
const stockClient = stockClientContainer.init({
    stockServiceUrl
});
let loginUserUseCase = loginUserUseCaseContainer.init({
    usersRepository,
    tokenRepository
});
const registerUserUseCase = registerUserUseCaseContainer.init({
    usersRepository
});
const getStockUseCase = getStockUseCaseContainer.init({
    stockClient,
    stockRepository
});
const getStockHistoryUseCase = getStockHistoryUseCaseContainer.init({
    stockRepository
});
const getStatsUseCase = getStatsUseCaseContainer.init({
    stockRepository
});
const app = appContainer.init({
    registerUserUseCase,
    loginUserUseCase,
    getStockUseCase,
    getStockHistoryUseCase,
    getStatsUseCase,
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
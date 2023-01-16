const request = require('supertest');
const jwt = require('jsonwebtoken');
const appContainer = require('../../../../../src/presentation/http/app');
const getStockUseCaseContainer = require('../../../../../src/application/get-stock.usecase');
const getStockHistoryUseCaseContainer = require('../../../../../src/application/get-stock-history.usecase');
const getStatsUseCaseContainer = require('../../../../../src/application/get-stats-stock.usecase');
const Stock = require("../../../../../src/domain/stocks/stock");
const getStockUseCase = getStockUseCaseContainer.init({});
const getStockHistoryUseCase = getStockHistoryUseCaseContainer.init({});
const getStatsUseCase = getStatsUseCaseContainer.init({});
const app = appContainer.init({
    getStockUseCase,
    getStockHistoryUseCase,
    getStatsUseCase,
});

const rawStock = {
    name: 'APPLE',
    symbol: 'AAPL.US',
    open: 132.03,
    high: 134.92,
    low: 131.66,
    close: 134.76,
    userId: '2ea26e75-2ad4-485d-b1cf-6297083a3f0b'
};
const reducedStock = {
    name: rawStock.name,
    symbol: rawStock.symbol,
    open: rawStock.open,
    high: rawStock.high,
    low: rawStock.low,
    close: rawStock.close,
}
const stats = [
    {
        stock: 'AA.US',
        times_requested: 2,
    }
];
const pagination = {
    pagination: {},
    data: [],
}
const jwtSecret = process.env.JWT_SECRET;
const testId = '2ea26e75-2ad4-485d-b1cf-6297083a3f0b';
const testRoleUser = ['user'];
const testRoleAdmin = ['admin'];
let testToken;

describe('Stock routes tests', () => {

    describe('GET /stock', () => {
        beforeEach(() => {
            testToken = jwt.sign({ id: testId, roles: testRoleUser }, jwtSecret, { expiresIn: 120 });
        });

        test('should return 200 and stock', async () => {
            jest.spyOn(getStockUseCase, 'execute').mockImplementation(() => Promise.resolve(new Stock(rawStock)));

            const res = await request(app).get('/stock').set('Authorization', `Bearer ${testToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(reducedStock);
        });

        test('should return 500', async () => {
            jest.spyOn(getStockUseCase, 'execute').mockImplementation(() => {
                throw new Error();
            });

            const res = await request(app).get('/stock').set('Authorization', `Bearer ${testToken}`);

            expect(res.statusCode).toEqual(500);
        });

        test('should return 401', async () => {
            const res = await request(app).get('/stock');

            expect(res.statusCode).toEqual(401);
        });
    });

    describe('GET /stock/history', () => {

        test('should return 200 and history', async () => {
            jest.spyOn(getStockHistoryUseCase, 'execute')
                .mockImplementation(() => Promise.resolve(pagination));

            const res = await request(app).get('/stock/history').set('Authorization', `Bearer ${testToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(pagination);
        });

        test('should return 500', async () => {
            jest.spyOn(getStockHistoryUseCase, 'execute').mockImplementation(() => {
                throw new Error();
            });

            const res = await request(app).get('/stock/history').set('Authorization', `Bearer ${testToken}`);

            expect(res.statusCode).toEqual(500);
        });
    });

    describe('GET /stock/stats', () => {

        test('should return 200 and stats', async () => {
            let testToken = jwt.sign({ id: testId, roles: testRoleAdmin }, jwtSecret, { expiresIn: 120 });
            jest.spyOn(getStatsUseCase, 'execute').mockImplementation(() => Promise.resolve(stats));

            const res = await request(app).get('/stock/stats').set('Authorization', `Bearer ${testToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toStrictEqual(stats);
        });

        test('should return 500', async () => {
            let testToken = jwt.sign({ id: testId, roles: testRoleAdmin }, jwtSecret, { expiresIn: 120 });
            jest.spyOn(getStatsUseCase, 'execute').mockImplementation(() => {
                throw new Error();
            });

            const res = await request(app).get('/stock/stats').set('Authorization', `Bearer ${testToken}`);

            expect(res.statusCode).toEqual(500);
        });

        test('should return 401 on bad role', async () => {
            const res = await request(app).get('/stock/stats').set('Authorization', `Bearer ${testToken}`);

            expect(res.statusCode).toEqual(401);
        });
    });
});
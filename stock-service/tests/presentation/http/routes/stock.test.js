const getStockUseCaseContainer = require("../../../../src/application/get-stock.usecase");
const appContainer = require("../../../../src/presentation/http/app");
const Stock = require("../../../../src/domain/stock");
const getStockUseCase = getStockUseCaseContainer.init({});
const request = require('supertest');
const app = appContainer.init({
    getStockUseCase
});

const rawStock = {
    name: "APPLE", symbol: "AAPL.US", open: 132.03, high: 134.92, low: 131.66, close: 134.76
};

describe('Stock routes test', () => {
    describe('GET /stock', () => {

        test('should return 200 and stock', async () => {
            jest.spyOn(getStockUseCase, 'execute').mockImplementation(() => Promise.resolve(new Stock(rawStock)));

            const res = await request(app).get('/stock');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(rawStock);
        });

        test('should return 500 on error', async () => {
            jest.spyOn(getStockUseCase, 'execute').mockImplementation(() => {
                throw new Error();
            });

            const res = await request(app).get('/stock');

            expect(res.statusCode).toEqual(500);
        });
    });
});
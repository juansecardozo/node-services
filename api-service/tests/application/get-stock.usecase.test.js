const Stock = require('../../src/domain/stocks/stock');
const getStockUseCaseFactory = require('../../src/application/get-stock.usecase');
const stockClientFactory = require('../../src/infrastructure/stocks/stock.client');
const stockRepositoryFactory = require('../../src/infrastructure/stocks/stock.repository');

const stockClient = stockClientFactory.init({});
const stockRepository = stockRepositoryFactory.init({});
const getStockUseCase = getStockUseCaseFactory.init({
    stockClient,
    stockRepository,
});

const rawStock = {
    name: "APPLE", symbol: "AAPL.US", open: 132.03, high: 134.92, low: 131.66, close: 134.76, userId: ""
};
const stock = new Stock(rawStock);

describe('Get stock use case test', () => {

    test('should call stockClient and get stock. Then it should call stockRepository save stock and return it',
        async () => {
            jest.spyOn(stockClient, 'getStock').mockImplementation(() => Promise.resolve(rawStock));
            jest.spyOn(stockRepository, 'createStockRecord')
                .mockImplementation(() => Promise.resolve(new Stock(rawStock)));

            const result = await getStockUseCase.execute({});

            expect(result).toStrictEqual(stock);
        });
});
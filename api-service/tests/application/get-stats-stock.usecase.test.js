const stockRepositoryFactory = require('../../src/infrastructure/stocks/stock.repository');
const getStatsStockUseCaseFactory = require('../../src/application/get-stats-stock.usecase');
const Stat = require("../../src/domain/stats/stat");

const stockRepository = stockRepositoryFactory.init({});
const getStatsStockUseCase = getStatsStockUseCaseFactory.init({
    stockRepository
});

const stats = [
    new Stat({
        stock: 'AA.US',
        times_requested: 2,
    }),
];

describe('Get stats stock use case test', () => {

    test('should return stats',
        async () => {
            jest.spyOn(stockRepository, 'getStats').mockImplementation(() => Promise.resolve(stats));

            const result = await getStatsStockUseCase.execute();

            expect(result).toStrictEqual(stats);
        });
});
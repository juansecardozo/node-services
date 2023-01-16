const stockRepositoryFactory = require('../../src/infrastructure/stocks/stock.repository');
const getStockHistoryUseCaseFactory = require('../../src/application/get-stock-history.usecase');
const {getDefaultLimit, getDefaultPage} = require("../../src/presentation/http/utils/pagination");

const stockRepository = stockRepositoryFactory.init({});
const getStockHistoryUseCase = getStockHistoryUseCaseFactory.init({
    stockRepository
});

const pagination = {
    pagination: {},
    data: [],
}

describe('Get stats stock use case test', () => {

    test('should return history', async () => {
        jest.spyOn(stockRepository, 'getStockHistory').mockImplementation(() => Promise.resolve(pagination));

        const result = await getStockHistoryUseCase.execute({
            limit: getDefaultLimit(45555),
            page: getDefaultPage(undefined)
        });

        expect(result).toStrictEqual(pagination);
    });

    test('should return history', async () => {
        jest.spyOn(stockRepository, 'getStockHistory').mockImplementation(() => {
            throw new Error();
        });

        expect(() => getStockHistoryUseCase.execute({
            limit: getDefaultLimit(25),
            page: getDefaultPage(1)
        })).rejects.toThrow(Error);
    });
});
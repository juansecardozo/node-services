const {StockDao} = require("../../../src/infrastructure/stocks/stock.schema");
const db = {
    schemas: {
        Stock: StockDao
    },
}
const stockRepositoryContainer = require('../../../src/infrastructure/stocks/stock.repository');
const Stock = require("../../../src/domain/stocks/stock");
const Stat = require("../../../src/domain/stats/stat");
const stockRepository = stockRepositoryContainer.init(db.schemas);

const rawStock = {
    name: "APPLE", symbol: "AAPL.US", open: 132.03, high: 134.92, low: 131.66, close: 134.76, userId: 4
};
const emptyPagination = {
    pagination: {},
    data: [],
};
const pagination = {
    pagination: {
        total: 1,
        page: 1,
        pages: 1,
        limit: 25
    },
    data: [
        new Stock(rawStock)
    ],
};
const stockHistory = {
    docs: [
        rawStock
    ],
    total: 1,
    page: 1,
    pages: 1,
    limit: 25
};
const stats = [
    {
        _id: 'APPL.US',
        times_requested: 3
    }
];
const finalStats = [
    new Stat({
        stock: 'APPL.US',
        times_requested: 3
    })
];

describe('Stock repository test', () => {

    test('should create stock', async () => {
        jest.spyOn(StockDao.prototype, 'save').mockImplementation(() => Promise.resolve(rawStock));

        const result = await stockRepository.createStockRecord(rawStock);

        expect(result).toStrictEqual(new Stock(rawStock));
    });

    test('should return stock history', async () => {
        jest.spyOn(db.schemas.Stock, 'paginate').mockImplementation(() => Promise.resolve({ docs: [] }));

        const result = await stockRepository.getStockHistory(rawStock);

        expect(result).toStrictEqual(emptyPagination);
    });

    test('should return stock history with data', async () => {
        jest.spyOn(db.schemas.Stock, 'paginate').mockImplementation(() => Promise.resolve(stockHistory));

        const result = await stockRepository.getStockHistory({});

        expect(result).toStrictEqual(pagination);
    });

    test('should return stats', async () => {
        jest.spyOn(db.schemas.Stock, 'aggregate').mockImplementationOnce(() => ({
            exec: () => stats,
        }));

        const result = await stockRepository.getStats();

        expect(result).toStrictEqual(finalStats);
    });
});
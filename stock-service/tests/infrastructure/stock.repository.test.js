const {StockDao} = require("../../src/infrastructure/stock.schema");
const db = {
    schemas: {
        Stock: StockDao
    },
}
const stockRepositoryContainer = require('../../src/infrastructure/stock.repository');
const Stock = require("../../src/domain/stock");
const stockRepository = stockRepositoryContainer.init(db.schemas);

const rawStock = {
    name: "APPLE", symbol: "AAPL.US", open: 132.03, high: 134.92, low: 131.66, close: 134.76
};

describe('Stock repository test', () => {

    test('should return stock', async () => {
        jest.spyOn(db.schemas.Stock, 'findOneAndUpdate').mockImplementation(() => Promise.resolve(rawStock));

        const result = await stockRepository.upsert(rawStock);

        expect(result).toStrictEqual(new Stock(rawStock));
    });
});
const mapper = require('./mapper');
const StockDomainModel = require('../domain/stock');

const stockStore = {
    async upsert({ name, symbol, open, high, low, close }) {
        const { Stock: stockSchema } = this.getSchemas();
        const query = { symbol: symbol };
        const update = { name, open, high, low, close };
        const stockDoc = await stockSchema.findOneAndUpdate(query, update, {
            new: true,
            upsert: true,
        });

        return mapper.toDomainModel(stockDoc, StockDomainModel);
    }
}

module.exports.init = function init({ Stock }) {
    return Object.assign(Object.create(stockStore), {
        getSchemas() {
            return {
                Stock
            }
        }
    });
}
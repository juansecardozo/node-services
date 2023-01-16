const mapper = require('../mapper');
const StockDomainModel = require('../../domain/stocks/stock');
const StatDomainModel = require('../../domain/stats/stat');

const DEFAULT_PAGINATION_CONTENT = {
    pagination: {},
    data: [],
};

const handlePaginationResponse = (response) => {
    if (!response.docs || response.docs.length <= 0) {
        return DEFAULT_PAGINATION_CONTENT;
    }
    return {
        data: response.docs.map((doc) => mapper.toDomainModel(doc, StockDomainModel)),
        pagination: {
            total: response.total,
            limit: response.limit,
            page: response.page,
            pages: response.pages,
        },
    };
};

const stockStore = {
    async createStockRecord({ name, symbol, open, high, low, close, userId }) {
        const { Stock: stockSchema } = this.getSchemas();
        const newStockRecord = new stockSchema({ name, symbol, open, high, low, close, userId });
        const stockDoc = await newStockRecord.save();

        return mapper.toDomainModel(stockDoc, StockDomainModel);
    },

    async getStockHistory(options) {
        const { Stock: stockSchema } = this.getSchemas();
        const query = {userId: options.userId};
        const paginationOptions = {
            page: options.page || 1,
            limit: options.limit || 25,
        };
        const docs = await stockSchema.paginate(query, paginationOptions);
        return handlePaginationResponse(docs);
    },

    async getStats() {
        const { Stock: stockSchema } = this.getSchemas();
        const stats = await stockSchema.aggregate([
            {
                "$group": {
                    _id: "$symbol",
                    times_requested: {
                        $sum: 1
                    }
                }
            }
        ]).exec();

        return stats.map(stat => mapper.toDomainModel({
            stock: stat._id,
            times_requested: stat.times_requested,
        }, StatDomainModel));
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
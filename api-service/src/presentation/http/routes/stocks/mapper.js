const StockResponse = require('./response');

const toResponseModel = function toResponseModel(stockDoc) {
    return new StockResponse({ ...stockDoc });
};

module.exports = {
    toResponseModel,
};

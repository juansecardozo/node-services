const {Schema, model} = require("mongoose");
const mongoosePaginate = require('mongoose-paginate');

const StockSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    symbol: {
        type: String,
        required: true
    },
    open: {
        type: Number,
        required: true
    },
    high: {
        type: Number,
        required: true
    },
    low: {
        type: Number,
        required: true
    },
    close: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
});

StockSchema.plugin(mongoosePaginate);

const StockDao = model('Stock', StockSchema);

module.exports = { StockDao };
const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
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
    }
});

const StockDao = mongoose.model('Stock', StockSchema);

module.exports = {
    StockDao
}
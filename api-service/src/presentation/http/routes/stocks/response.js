class StockResponse {
    constructor({name, symbol, open, high, low, close}) {
        this.name = name;
        this.symbol = symbol;
        this.open = open;
        this.high = high;
        this.low = low;
        this.close = close;
    }
}

module.exports = StockResponse
class Stock {
    constructor({name, symbol, open, high, low, close, userId}) {
        this.name = name;
        this.symbol = symbol;
        this.open = open;
        this.high = high;
        this.low = low;
        this.close = close;
        this.userId = userId;
    }
}

module.exports = Stock
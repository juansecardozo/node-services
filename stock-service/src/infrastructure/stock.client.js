const https = require("https");
const CSV = require('csv-string');

const lowercaseKeys = obj =>
    Object.keys(obj).reduce((acc, key) => {
        acc[key.toLowerCase()] = obj[key];
        return acc;
    }, {});

module.exports.init = () => {
    const getStock = (stock_code) => {
        return new Promise((resolve, reject) => {
            https.get(`https://stooq.com/q/l/?s=${stock_code}&f=sd2t2ohlcvn&h&e=csv`, res => {
                res.on('data', (data) => {
                    const parsedData = CSV.parse(data.toString(), { output: 'objects' });
                    resolve(lowercaseKeys(parsedData[0]))
                })
            }).on('error', err => reject(err));
        });
    }

    return {
        getStock,
    }
}
const http = require("http");

module.exports.init = ({ stockServiceUrl }) => {
    const getStock = (stock_code) => {
        return new Promise((resolve, reject) => {
            http.get(`${stockServiceUrl}?stock_code=${stock_code}`, res => {
                res.on('data', (data) => {
                    resolve(JSON.parse(data));
                })
            }).on('error', err => reject(err));
        });
    }

    return {
        getStock,
    }
}
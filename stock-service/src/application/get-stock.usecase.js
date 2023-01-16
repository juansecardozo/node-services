const init = ({
    stockClient,
    stockRepository
}) => {
    const execute = async (stock_code) => {
        const stockData = await stockClient.getStock(stock_code);
        return await stockRepository.upsert(stockData);
    }

    return {
        execute
    }
}

module.exports.init = init
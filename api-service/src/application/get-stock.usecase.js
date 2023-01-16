const init = ({
    stockClient,
    stockRepository,
}) => {
    const execute = async ({stock_code, user_id}) => {
        const stock = await stockClient.getStock(stock_code);
        return await stockRepository.createStockRecord({...stock, userId: user_id});
    }

    return {
        execute
    }
}

module.exports.init = init;
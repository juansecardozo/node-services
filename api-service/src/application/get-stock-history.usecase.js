const init = ({
    stockRepository
}) => {
    const execute = async ({userId, limit, page}) => {
        return await stockRepository.getStockHistory({userId, limit, page});
    }

    return {
        execute
    }
}

module.exports.init = init;
const init = ({ stockRepository }) => {
    const execute = async () => {
        return await stockRepository.getStats();
    }

    return {
        execute
    }
}

module.exports.init = init;
const express = require('express');
const {getDefaultPage, getDefaultLimit} = require("../../utils/pagination");
const {toResponseModel} = require("./mapper");

const router = express.Router({ mergeParams: true });

const init = ({
    getStockUseCase,
                  getStockHistoryUseCase,
    getStatsUseCase,
}) => {
    router.get('/', async (req, res) => {
        try{
            const stock = await getStockUseCase.execute({
                stock_code: req.query.stock_code,
                user_id: req.auth.id,
            });

            res.send(toResponseModel(stock));
        } catch(err) {
            return res.status(500).send();
        }
    });

    router.get('/history', async (req, res) => {
        try {
            const stockHistory = await getStockHistoryUseCase.execute({
                userId: req.auth.id,
                page: getDefaultPage(parseInt(req.query.page, 10)),
                limit: getDefaultLimit(parseInt(req.query.limit, 10)),
            });
            stockHistory.data = stockHistory.data.map(data => toResponseModel(data));

            res.send(stockHistory);
        } catch(err) {
            return res.status(500).send();
        }
    });

    router.get('/stats', async (req, res) => {
        if (!req.auth.roles.includes('admin')) {
            return res.status(401).send();
        }

        try{
            const stats = await getStatsUseCase.execute();

            res.send(stats);
        } catch(err) {
            return res.status(500).send();
        }
    })

    return router;
}

module.exports.init = init;
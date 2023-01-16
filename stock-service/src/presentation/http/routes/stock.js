const express = require('express');
const router = express.Router();

const init = ({ getStockUseCase }) => {
    router.get('/', async (req, res) => {
        try {
            const stock = await getStockUseCase.execute(req.query.stock_code);
            return res.send(stock);
        } catch (err) {
            console.error(err);
            return res.status(500).send();
        }
    });

    return router;
}

module.exports.init = init;
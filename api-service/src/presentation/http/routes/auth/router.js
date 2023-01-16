const express = require('express');
const {toResponseModel} = require("../users/mapper");
const {InvalidArgumentException} = require("../../../../common/exceptions/invalid-argument");
const {WrongPasswordException} = require("../../../../common/exceptions/wrong-password");
const {UserNotFoundException} = require("../../../../common/exceptions/user-not-found");

const router = express.Router();

const init = ({ loginUserUseCase, registerUserUseCase }) => {

    router.post('/register', async (req, res) => {
        try {
            const result = await registerUserUseCase.execute({
                email: req.body.email,
                role: req.body.role,
                password: req.body.password
            });

            return res.send(toResponseModel(result));
        } catch (err) {
            if (err instanceof InvalidArgumentException) {
                return res.status(400).send({ message: err.message });
            }
            return res.status(500).send();
        }
    });

    router.post('/login', async (req, res) => {
        try {
            const result = await loginUserUseCase.execute({
                email: req.body.email,
                password: req.body.password
            });

            return res.send({
                token: result.token,
                user: toResponseModel(result.user)
            });
        } catch (err) {
            if (err instanceof WrongPasswordException) {
                return res.status(401).send({ message: err.message });
            }
            if (err instanceof UserNotFoundException) {
                return res.status(404).send({ message: err.message });
            }
            return res.status(500).send();
        }
    });

    return router;
}

module.exports.init = init;
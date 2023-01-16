const jwt = require("jsonwebtoken");
const {jwtSecret} = require("../../config");
const {USER_TOKEN_EXPIRATION} = require("../../common/constants");
const {toDomainModel} = require("../mapper");
const DomainToken = require("../../domain/tokens/token");

module.exports.init = () => {
     const createUserToken = (user) => {
        const token = {
            accessToken: jwt.sign({
                id: user.id,
                roles: [user.role],
            }, jwtSecret, {
                expiresIn: USER_TOKEN_EXPIRATION,
            }),
            tokenType: 'Bearer',
            roles: [user.role],
            expiresIn: USER_TOKEN_EXPIRATION,
        };
        return toDomainModel(token, DomainToken);
    }

    return {
        createUserToken,
    }
}
const {InvalidArgumentException} = require("../../common/exceptions/invalid-argument");

class Token {
    constructor({ accessToken, expiresIn, tokenType, roles }) {
        this.accessToken = accessToken;
        this.expiresIn = expiresIn;
        this.tokenType = tokenType;
        this.roles = roles;
    }
}

module.exports = Token;